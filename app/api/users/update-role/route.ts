export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
    const role = req.headers.get("x-role");
    const adminId = req.headers.get("x-user-id");
    const orgId = req.headers.get("x-org-id");

    if (role !== "ADMIN") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { userId, newRole } = await req.json();

        if (!userId || !newRole) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        if (orgId && adminId) {
            await logAction(orgId, adminId, "ROLE_UPDATED", {
                targetUser: userId,
                newRole,
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Update role error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
