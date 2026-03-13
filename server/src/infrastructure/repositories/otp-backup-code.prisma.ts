import { prisma } from "../../prisma/client";

export class OtpBackupCodeRepositoryPrisma {
  async createMany(userId: string, codeHashes: string[]) {
    await prisma.otpBackupCode.createMany({
      data: codeHashes.map((codeHash) => ({ userId, codeHash })),
    });
  }

  async findUnusedByUserId(userId: string) {
    return prisma.otpBackupCode.findMany({
      where: { userId, usedAt: null },
      select: { id: true, codeHash: true },
    });
  }

  async markUsed(id: string) {
    await prisma.otpBackupCode.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async deleteAllForUser(userId: string) {
    await prisma.otpBackupCode.deleteMany({ where: { userId } });
  }
}