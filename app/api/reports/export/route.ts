export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { stringify } from "csv-stringify/sync";
import { logAction } from "@/lib/audit";

export async function GET(req: Request) {
    const orgId = req.headers.get("x-org-id");
    if (!orgId)
        return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const metrics = await prisma.metric.findMany({
        where: {
            orgId,
            ...(start && end
                ? {
                    date: {
                        gte: new Date(start),
                        lte: new Date(end),
                    },
                }
                : {}),
        },
        orderBy: { date: "asc" },
    });

    const csv = stringify(
        metrics.map(m => ({
            date: m.date.toISOString().split("T")[0],
            revenue: m.revenue,
            orders: m.orders,
            customers: m.customers,
        })),
        { header: true }
    );

    const userId = req.headers.get("x-user-id");
    if (orgId && userId) {
        await logAction(orgId, userId, "REPORT_EXPORTED", {
            start: start || "all",
            end: end || "all",
        });
    }

    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=report.csv",
        },
    });
}
