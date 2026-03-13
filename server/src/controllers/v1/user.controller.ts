import type { NextFunction, Request, Response } from "express";
import { UpdateMeUseCase } from "../../application/usecases/update-me.usecase";
import { UserRepositoryPrisma } from "../../infrastructure/repositories/user-repository.prisma";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.jsonError("Unauthorized", 401);
    }

    const repository = new UserRepositoryPrisma();
    const user = await repository.findById(userId);

    if (!user) {
      return res.jsonError("User not found", 404);
    }

    const safe = {
      id: user.props.id,
      firstname: user.props.firstname,
      lastname: user.props.lastname,
      email: user.props.email,
      otpEnabled: !!user.props.otpEnabled,
    };

    return res.jsonSuccess(safe);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.jsonError("Unauthorized", 401);
    }

    const { firstname, lastname, email } = req.body ?? {};
    if (!firstname && !lastname && !email) {
      return res.jsonError("Missing profile fields", 400);
    }

    const repository = new UserRepositoryPrisma();
    const usecase = new UpdateMeUseCase(repository);

    const result = await usecase.execute(userId, { firstname, lastname, email });

    const safe = {
      id: (result as any).id ?? (result as any)?.props?.id,
      firstname: (result as any).firstname ?? (result as any)?.props?.firstname,
      lastname: (result as any).lastname ?? (result as any)?.props?.lastname,
      email: (result as any).email ?? (result as any)?.props?.email,
      otpEnabled: !!((result as any).otpEnabled ?? (result as any)?.props?.otpEnabled),
    };

    return res.jsonSuccess(safe);
  } catch (error) {
    next(error);
  }
};