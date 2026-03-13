import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { OtpBackupCodeRepositoryPrisma } from "../../infrastructure/repositories/otp-backup-code.prisma";

export class Disable2FaUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly backupRepo: OtpBackupCodeRepositoryPrisma
  ) {}

  async execute(userId: string) {
    await this.userRepository.setOtpEnabled(userId, false);
    await this.userRepository.setOtpSecret(userId, null);
    await this.backupRepo.deleteAllForUser(userId);
    return { ok: true };
  }
}