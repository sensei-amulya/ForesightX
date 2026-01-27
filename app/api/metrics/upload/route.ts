export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { parseCSV } from "@/lib/csv";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const orgId = req.headers.get("x-org-id");
        const role = req.headers.get("x-role");

        if (role === "VIEWER") {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        if (!orgId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "CSV file missing" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const rows = parseCSV(buffer);

        await prisma.metric.createMany({
            data: rows.map(r => ({
                orgId,
                date: new Date(r.date),
                revenue: r.revenue,
                orders: r.orders,
                customers: r.customers,
            })),
        });

        return NextResponse.json({
            message: "CSV uploaded successfully",
            rowsInserted: rows.length,
        });
    } catch (err: any) {
        console.error("CSV UPLOAD ERROR:", err.message);
        return NextResponse.json(
            { error: err.message || "CSV upload failed" },
            { status: 500 }
        );
    }
}
