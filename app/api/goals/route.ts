export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const orgId = req.headers.get("x-org-id");
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // Format: YYYY-MM

    if (!orgId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!month) {
        return NextResponse.json({ error: "Month parameter is required (YYYY-MM)" }, { status: 400 });
    }

    try {
        const goals = await prisma.goal.findMany({
            where: {
                orgId: orgId,
                month: month,
            },
        });
        return NextResponse.json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const orgId = req.headers.get("x-org-id");
    const role = req.headers.get("x-role");

    if (!orgId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "ADMIN" && role !== "MANAGER") {
        return NextResponse.json({ error: "Forbidden: Only Admins and Managers can set goals" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { type, target, month } = body;

        if (!type || !target || !month) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if goal already exists for this type and month, if so, update it
        const existingGoal = await prisma.goal.findFirst({
            where: {
                orgId: orgId,
                type: type,
                month: month,
            },
        });

        let goal;
        if (existingGoal) {
            goal = await prisma.goal.update({
                where: { id: existingGoal.id },
                data: { target: parseFloat(target) },
            });
        } else {
            goal = await prisma.goal.create({
                data: {
                    orgId: orgId,
                    type: type,
                    target: parseFloat(target),
                    month: month,
                },
            });
        }

        // Log action (optional, leveraging existing audit log system if desired)
        /*
        await prisma.auditLog.create({
            data: {
                orgId,
                userId: "system", // ideally we'd have the real user ID from auth context
                action: existingGoal ? "UPDATED_GOAL" : "CREATED_GOAL",
                metadata: `${type} target set to ${target} for ${month}`
            }
        });
        */

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Error setting goal:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
