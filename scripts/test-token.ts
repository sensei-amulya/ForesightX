import "dotenv/config";
import { generateToken, verifyToken } from "../lib/token";

async function main() {
    try {
        console.log("Generating token...");
        const payload = { userId: "u1", orgId: "o1", role: "ADMIN" };
        const token = await generateToken(payload);
        console.log("Token:", token);

        console.log("Verifying token...");
        const decoded = await verifyToken(token) as any;
        console.log("Decoded:", decoded);

        if (decoded.userId === payload.userId) {
            console.log("SUCCESS: Token logic works.");
        } else {
            console.error("FAILURE: Payload mismatch.");
            process.exit(1);
        }
    } catch (e) {
        console.error("ERROR:", e);
        process.exit(1);
    }
}

main();
