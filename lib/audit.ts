import { prisma } from "@/lib/db";

export async function logAction(
  orgId: string,
  userId: string,
  action: string,
  metadata?: any
) {
  await prisma.auditLog.create({
    data: {
      orgId,
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
