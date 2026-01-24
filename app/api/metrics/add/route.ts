export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const orgId = req.headers.get("x-org-id");
        if (!orgId) {
            return NextResponse.json({ error: "Org missing" }, { status: 401 });
        }

        const { date, revenue, orders, customers } = await req.json();

        if (!date || revenue == null || orders == null || customers == null) {
            return NextResponse.json(
                { error: "Missing metric fields" },
                { status: 400 }
            );
        }

        const metric = await prisma.metric.create({
            data: {
                orgId,
                date: new Date(date),
                revenue,
                orders,
                customers,
            },
        });

        return NextResponse.json({ metric });
    } catch (err) {
        console.error("ADD METRIC ERROR:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
