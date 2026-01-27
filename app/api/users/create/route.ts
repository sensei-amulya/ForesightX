export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
    const orgId = req.headers.get("x-org-id");
    const role = req.headers.get("x-role");

    if (role !== "ADMIN") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, role: newRole } = await req.json();

    if (!email || !newRole) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const defaultPassword = "Welcome@123";
    const hashed = await hashPassword(defaultPassword);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashed,
                role: newRole,
                orgId: orgId!,
            },
        });

        return Response.json({
            message: "User created",
            defaultPassword,
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return Response.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
