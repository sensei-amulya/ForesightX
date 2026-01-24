import bcrypt from "bcrypt";

export * from "./token";

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}
