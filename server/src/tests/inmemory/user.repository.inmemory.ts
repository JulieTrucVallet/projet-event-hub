import { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class UserRepositoryInMemory implements IUserRepository {
  public users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.props.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.props.email === normalized) ?? null;
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
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = User.create({
      ...existing.props,
      ...(data.firstname !== undefined ? { firstname: data.firstname } : {}),
      ...(data.lastname !== undefined ? { lastname: data.lastname } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
      ...(data.otpEnabled !== undefined ? { otpEnabled: data.otpEnabled } : {}),
      ...(data.otpSecret !== undefined
        ? data.otpSecret === null
          ? {}
          : { otpSecret: data.otpSecret }
        : {}),
      updatedAt: new Date(),
    });

    this.users = this.users.map((u) => (u.props.id === id ? updated : u));
    return updated;
  }

  async setOtpSecret(userId: string, secret: string | null): Promise<void> {
    const existing = await this.findById(userId);
    if (!existing) return;

    const updated = User.create({
      ...existing.props,
      ...(secret !== null ? { otpSecret: secret } : {}),
      updatedAt: new Date(),
    });

    this.users = this.users.map((u) => (u.props.id === userId ? updated : u));
  }

  async setOtpEnabled(userId: string, enabled: boolean): Promise<void> {
    const existing = await this.findById(userId);
    if (!existing) return;

    const updated = User.create({
      ...existing.props,
      otpEnabled: enabled,
      updatedAt: new Date(),
    });

    this.users = this.users.map((u) => (u.props.id === userId ? updated : u));
  }
}