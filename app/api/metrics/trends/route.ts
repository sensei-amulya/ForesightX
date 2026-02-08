export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const orgId = req.headers.get("x-org-id");

    if (!orgId) {
        return new Response("Missing x-org-id header", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const metrics = await prisma.metric.findMany({
        where: {
            orgId,
            date: {
                gte: start ? new Date(start) : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Default to last month if no range
                lte: end ? new Date(end) : new Date(),
            },
        },
        orderBy: { date: "asc" },
    });

    return Response.json(
        metrics.map(m => ({
            date: m.date.toISOString().split("T")[0],
            revenue: m.revenue,
            orders: m.orders,
            customers: m.customers,
        }))
    );
}
