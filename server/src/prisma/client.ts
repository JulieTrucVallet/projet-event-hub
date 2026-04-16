import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("Missing DATABASE_URL");
    }

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  return prisma;
}

export async function disconnectPrismaClient() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}