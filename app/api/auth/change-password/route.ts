export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
    const userId = req.headers.get("x-user-id");
    const { newPassword } = await req.json();

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 6) {
        return Response.json(
            { error: "Password must be at least 6 characters" },
            { status: 400 }
        );
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { password: await hashPassword(newPassword) },
        });

        // The user ID comes from x-user-id header, but we need orgId too.
        // Assuming we can get orgId from the user, or pass it via headers (middleware sets x-org-id).
        const orgId = req.headers.get("x-org-id");
        if (orgId) {
            await logAction(orgId, userId, "PASSWORD_CHANGED");
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Password update error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
