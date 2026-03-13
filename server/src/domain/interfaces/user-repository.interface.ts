import { User } from "../entities/user.entity";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  updateById(
    id: string,
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;

      passwordHash?: string;

      otpEnabled?: boolean;
      otpSecret?: string | null;
    }
  ): Promise<User | null>;

  setOtpSecret(userId: string, secret: string | null): Promise<void>;
  setOtpEnabled(userId: string, enabled: boolean): Promise<void>;
}