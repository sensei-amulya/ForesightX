export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const orgId = req.headers.get("x-org-id");

    if (!orgId) {
        return new Response("Missing x-org-id header", { status: 400 });
    }

    const metrics = await prisma.metric.findMany({
        where: { orgId },
        orderBy: { date: "asc" },
    });

    return Response.json(
        metrics.map(m => ({
            date: m.date.toISOString().split("T")[0],
            revenue: m.revenue,
        }))
    );
}
