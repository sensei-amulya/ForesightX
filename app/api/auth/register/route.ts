import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";
export const runtime = "nodejs";


export async function POST(req: Request) {
    try {
        const { email, password, orgName } = await req.json();

        if (!email || !password || !orgName) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashed = await hashPassword(password);

        const org = await prisma.organization.create({
            data: { name: orgName },
        });

        const user = await prisma.user.create({
            data: {
                email,
                password: hashed,
                role: "ADMIN",
                orgId: org.id,
            },
        });

        const token = generateToken({
            userId: user.id,
            orgId: org.id,
            role: user.role,
        });

        return NextResponse.json({ token });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
