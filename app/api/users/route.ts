export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const orgId = req.headers.get("x-org-id");
    const role = req.headers.get("x-role");

    if (role !== "ADMIN") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        where: { orgId: orgId! },
        select: { id: true, email: true, role: true },
    });

    return Response.json(users);
}
