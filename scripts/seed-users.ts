
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 STARTING SEED...");

    // 1. Get or Create Organization
    let org = await prisma.organization.findFirst();

    if (!org) {
        console.log("No organization found. Creating one...");
        org = await prisma.organization.create({
            data: {
                name: "Alpha Corp",
            },
        });
    }

    console.log(`Using Organization: ${org.name} (${org.id})`);

    // 2. Hash Password
    const password = await bcrypt.hash("manager123", 10);
    const passwordViewer = await bcrypt.hash("viewer123", 10);

    // 3. Create/Update Manager
    const manager = await prisma.user.upsert({
        where: { email: "manager@alpha.com" },
        update: {
            password: password,
            role: "MANAGER",
            orgId: org.id
        },
        create: {
            email: "manager@alpha.com",
            password: password,
            role: "MANAGER",
            orgId: org.id,
        },
    });
    console.log(`✅ Created/Updated MANAGER: ${manager.email}`);

    // 4. Create/Update Viewer
    const viewer = await prisma.user.upsert({
        where: { email: "viewer@alpha.com" },
        update: {
            password: passwordViewer,
            role: "VIEWER",
            orgId: org.id
        },
        create: {
            email: "viewer@alpha.com",
            password: passwordViewer,
            role: "VIEWER",
            orgId: org.id,
        },
    });
    console.log(`✅ Created/Updated VIEWER: ${viewer.email}`);

    console.log("🚀 SEED COMPLETE");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
