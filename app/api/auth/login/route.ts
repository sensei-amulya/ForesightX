import { prisma } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await generateToken({
        userId: user.id,
        orgId: user.orgId,
        role: user.role,
    });

    await logAction(user.orgId, user.id, "USER_LOGIN", {
        method: "email",
    });

    // Update lastActive
    await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() },
    });

    return NextResponse.json({ token });
}
