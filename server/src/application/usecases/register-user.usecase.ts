import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { User } from "../../domain/entities/user.entity";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export interface RegisterUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(payload: RegisterUserPayload): Promise<{ id: string }> {
    const email = payload.email.trim().toLowerCase();
    const firstname = payload.firstname?.trim();
    const lastname = payload.lastname?.trim();

    if (!firstname || !lastname || !email || !payload.password) {
      throw new Error("Missing required fields");
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already used");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = User.create({
      id: randomUUID(),
      firstname,
      lastname,
      email,
      passwordHash,
      otpEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.userRepository.save(user);

    return { id: saved.id };
  }
}