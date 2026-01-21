import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
    console.log("Attempting to connect to database...");
    try {
        await prisma.$connect();
        console.log("Successfully connected to database!");
        const users = await prisma.user.count();
        console.log(`User count: ${users}`);
        await prisma.$disconnect();
    } catch (e) {
        console.error("Error connecting to database:", e);
        process.exit(1);
    }
}

main();
