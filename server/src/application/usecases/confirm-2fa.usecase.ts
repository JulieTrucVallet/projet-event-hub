import { authenticator } from "@otplib/preset-default";
import crypto from "crypto";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { OtpBackupCodeRepositoryPrisma } from "../../infrastructure/repositories/otp-backup-code.prisma";

function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

function hash(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export class Confirm2FaUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly backupRepo: OtpBackupCodeRepositoryPrisma
  ) {}

  async execute(userId: string, token: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const secret = user.props.otpSecret;
    if (!secret) throw new Error("OTP secret not initialized");

    const ok = authenticator.check(token, secret);
    if (!ok) {
      const err: any = new Error("CONNECTION_2AF_INVALID");
      err.statusCode = 401;
      throw err;
    }

    await this.userRepository.setOtpEnabled(userId, true);

    const backupCodes = generateBackupCodes(10);
    const codeHashes = backupCodes.map(hash);

    await this.backupRepo.deleteAllForUser(userId);
    await this.backupRepo.createMany(userId, codeHashes);

    return { backupCodes };
  }
}