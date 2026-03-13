import type { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export interface UpdateMePayload {
  firstname?: string;
  lastname?: string;
  email?: string;
}

export class UpdateMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, payload: UpdateMePayload) {
    const data: {
      firstname?: string;
      lastname?: string;
      email?: string;
      updatedAt?: Date;
    } = {};

    if (typeof payload.firstname === "string") {
      const v = payload.firstname.trim();
      if (v.length > 0) data.firstname = v;
    }

    if (typeof payload.lastname === "string") {
      const v = payload.lastname.trim();
      if (v.length > 0) data.lastname = v;
    }

    if (typeof payload.email === "string") {
      const v = payload.email.trim().toLowerCase();
      if (v.length > 0) data.email = v;
    }

    if (Object.keys(data).length === 0) {
      throw new Error("No fields to update");
    }

    if (data.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing && existing.props.id !== id) {
        throw new Error("Email already used");
      }
    }

    data.updatedAt = new Date();

    const updated = await this.userRepository.updateById(id, data);
    if (!updated) {
      throw new Error("User not found");
    }

    return updated.props;
  }
}