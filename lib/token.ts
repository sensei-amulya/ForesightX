import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function generateToken(payload: {
    userId: string;
    orgId: string;
    role: string;
}) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
}
