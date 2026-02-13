import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";
import * as jose from "jose";

export async function POST(req: Request) {
    console.log("Analysis API called");
    console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

    try {
        // 1. Authentication
        const headersList = await headers();
        const authorization = headersList.get("authorization");

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authorization.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

        try {
            await jose.jwtVerify(token, secret);
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Get payload to find orgId if needed, but for now we might trust the token or fetch user
        // Decode token to get orgId
        const { payload } = await jose.jwtVerify(token, secret);
        const orgId = payload.orgId as string;

        if (!orgId) {
            return NextResponse.json({ error: "Organization ID not found in token" }, { status: 400 });
        }

        // 2. Fetch recent metrics (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const metrics = await prisma.metric.findMany({
            where: {
                orgId: orgId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        if (metrics.length === 0) {
            return NextResponse.json({ analysis: "No data available for analysis. Please add some metrics to get started." });
        }

        // 3. Construct Prompt
        // Simplify data for the prompt to save tokens and focus on trends
        const simplifiedData = metrics.map(m => ({
            date: m.date.toISOString().split("T")[0],
            revenue: m.revenue,
            orders: m.orders,
            customers: m.customers
        }));

        const prompt = `
        You are a seasoned Chief Financial Officer (CFO) for a SaaS company. Analyze the following daily metrics for the last 30 days, where all monetary values are in Indian Rupees (₹).
        
        Provide a sophisticated, executive-level summary of the business performance in max to max 200 words. Your analysis should be structured and professional.

        Include the following sections (formatted in Markdown):
        1. **Executive Summary**: A high-level overview of performance.
        2. **Key Trends**: Analyze patterns in revenue (₹), order volume, and customer acquisition.
        3. **Anomalies & Risks**: Highlight any significant dips or spikes.
        4. **Strategic Recommendations**: Actionable insights based on the data.

        Data:
        ${JSON.stringify(simplifiedData)}
        `;

        // 4. Call Google Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error("Analysis error details:", error);
        return NextResponse.json({ error: error.message || "Failed to generate analysis" }, { status: 500 });
    }
}
