export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const orgId = req.headers.get("x-org-id");
        if (!orgId) {
            return NextResponse.json({ error: "Org missing" }, { status: 401 });
        }

        const metrics = await prisma.metric.findMany({
            where: { orgId },
        });

        const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
        const totalOrders = metrics.reduce((sum, m) => sum + m.orders, 0);
        const totalCustomers = metrics.reduce((sum, m) => sum + m.customers, 0);

        const days = metrics.length || 1;

        return NextResponse.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            avgDailyRevenue: Math.round(totalRevenue / days),
        });
    } catch (err) {
        console.error("KPI ERROR:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
