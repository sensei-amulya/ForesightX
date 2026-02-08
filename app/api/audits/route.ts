export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const orgId = req.headers.get("x-org-id");
    const role = req.headers.get("x-role");

    // Only check role if it's provided by middleware, assuming middleware does verification
    // But for extra safety, we can return forbidden if headers are missing or role isn't ADMIN

    console.log("Audit API Headers - x-org-id:", orgId, "x-role:", role);

    if (!orgId) {
        return Response.json({ error: "Unauthorized: Missing Organization ID" }, { status: 401 });
    }

    if (role !== "ADMIN") {
        // If you want to verify that the logged-in user is indeed an admin
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
        where: { orgId: orgId as string },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return Response.json(logs);
}
