import bcrypt from "bcryptjs";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export interface LoginUserPayload {
  email: string;
  password: string;
}

export type LoginUserResult = {
  user: { id: string; firstname: string; lastname: string; email: string };
  requires2fa: boolean;
};

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(payload: LoginUserPayload): Promise<LoginUserResult> {
    const email = payload.email.trim().toLowerCase();
    const password = payload.password;

    if (!email || !password) {
      throw new Error("Missing credentials");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.props.passwordHash);
    if (!ok) {
      throw new Error("Invalid credentials");
    }

    return {
      user: {
        id: user.props.id,
        firstname: user.props.firstname,
        lastname: user.props.lastname,
        email: user.props.email,
      },
      requires2fa: user.props.otpEnabled === true,
    };
  }
}