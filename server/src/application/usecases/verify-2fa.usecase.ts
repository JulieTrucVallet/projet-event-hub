import { authenticator } from "@otplib/preset-default";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class Verify2FaUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, token: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.props.otpEnabled) {
      throw new Error("2FA not enabled");
    }

    const secret = user.props.otpSecret;
    if (!secret) throw new Error("Missing OTP secret");

    const ok = authenticator.check(token, secret);
    if (!ok) {
      const err: any = new Error("CONNECTION_2AF_INVALID");
      err.statusCode = 401;
      throw err;
    }

    return { ok: true };
  }
}