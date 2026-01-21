import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET!;

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function generateToken(payload: {
    userId: string;
    orgId: string;
    role: string;
}) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
