import { authenticator } from "@otplib/preset-default";
import QRCode from "qrcode";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class Init2FaUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.props.email, "EventHub", secret);

    await this.userRepository.setOtpSecret(userId, secret);
    await this.userRepository.setOtpEnabled(userId, false);

    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

    return { secret, qrCodeDataUrl };
  }
}