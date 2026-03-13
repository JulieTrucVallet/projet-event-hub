import { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { prisma } from "../../prisma/client";

export class UserRepositoryPrisma implements IUserRepository {
  async save(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        ...(user.props.id ? { id: user.props.id } : {}),
        firstname: user.props.firstname,
        lastname: user.props.lastname,
        email: user.props.email,
        passwordHash: user.props.passwordHash,
        otpEnabled: user.props.otpEnabled,
        ...(user.props.otpSecret !== undefined ? { otpSecret: user.props.otpSecret } : {}),
      },
    });

    return User.create({
      id: created.id,
      firstname: created.firstname,
      lastname: created.lastname,
      email: created.email,
      passwordHash: created.passwordHash,
      otpEnabled: created.otpEnabled,
      ...(created.otpSecret !== null ? { otpSecret: created.otpSecret } : {}),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) return null;

    return User.create({
      id: u.id,
      firstname: u.firstname,
      lastname: u.lastname,
      email: u.email,
      passwordHash: u.passwordHash,
      otpEnabled: u.otpEnabled,
      ...(u.otpSecret !== null ? { otpSecret: u.otpSecret } : {}),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();

    const u = await prisma.user.findUnique({
      where: { email: normalized },
    });
    if (!u) return null;

    return User.create({
      id: u.id,
      firstname: u.firstname,
      lastname: u.lastname,
      email: u.email,
      passwordHash: u.passwordHash,
      otpEnabled: u.otpEnabled,
      ...(u.otpSecret !== null ? { otpSecret: u.otpSecret } : {}),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    });
  }

  async updateById(
    id: string,
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;
      passwordHash?: string;
      otpEnabled?: boolean;
      otpSecret?: string | null;
    }
  ): Promise<User | null> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.firstname !== undefined ? { firstname: data.firstname } : {}),
        ...(data.lastname !== undefined ? { lastname: data.lastname } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
        ...(data.otpEnabled !== undefined ? { otpEnabled: data.otpEnabled } : {}),
        ...(data.otpSecret !== undefined ? { otpSecret: data.otpSecret } : {}),
      },
    });

    return User.create({
      id: updated.id,
      firstname: updated.firstname,
      lastname: updated.lastname,
      email: updated.email,
      passwordHash: updated.passwordHash,
      otpEnabled: updated.otpEnabled,
      ...(updated.otpSecret !== null ? { otpSecret: updated.otpSecret } : {}),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async setOtpSecret(userId: string, secret: string | null): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { otpSecret: secret },
    });
  }

  async setOtpEnabled(userId: string, enabled: boolean): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { otpEnabled: enabled },
    });
  }

}