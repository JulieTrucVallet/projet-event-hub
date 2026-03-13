import crypto from "crypto";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { OtpBackupCodeRepositoryPrisma } from "../../infrastructure/repositories/otp-backup-code.prisma";

function hash(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export class UseBackupCodeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly backupRepo: OtpBackupCodeRepositoryPrisma
  ) {}

  async execute(userId: string, code: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const codes = await this.backupRepo.findUnusedByUserId(userId);
    const incomingHash = hash(code.trim());

    const match = codes.find((c) => c.codeHash === incomingHash);
    if (!match) {
      const err: any = new Error("CONNECTION_2AF_INVALID");
      err.statusCode = 401;
      throw err;
    }

    await this.backupRepo.markUsed(match.id);
    return { ok: true };
  }
}