import type { NextFunction, Request, Response } from "express";

import { LoginUserUseCase } from "../../application/usecases/login-user.usecase";
import { RegisterUserUseCase } from "../../application/usecases/register-user.usecase";

import { OtpBackupCodeRepositoryPrisma } from "../../infrastructure/repositories/otp-backup-code.prisma";
import { UserRepositoryPrisma } from "../../infrastructure/repositories/user-repository.prisma";

import { Confirm2FaUseCase } from "../../application/usecases/confirm-2fa.usecase";
import { Disable2FaUseCase } from "../../application/usecases/disable-2fa.usecase";
import { Init2FaUseCase } from "../../application/usecases/init-2fa.usecase";
import { UseBackupCodeUseCase } from "../../application/usecases/use-backup-code.usecase";
import { Verify2FaUseCase } from "../../application/usecases/verify-2fa.usecase";

import {
  signAccessToken,
  signPending2faToken,
  verifyPending2faToken,
} from "../../utility/jwt";

function setAccessTokenCookie(res: Response, token: string) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repository = new UserRepositoryPrisma();
    const usecase = new RegisterUserUseCase(repository);

    const result = await usecase.execute(req.body);
    return res.jsonSuccess(result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.jsonError("Missing email or password", 400);
    }

    const repository = new UserRepositoryPrisma();
    const usecase = new LoginUserUseCase(repository);

    const result = await usecase.execute({ email, password });

    if (result.requires2fa) {
      const pendingToken = signPending2faToken(result.user.id);

      return res.jsonSuccess({
        requires2fa: true,
        pendingToken,
        user: { email: result.user.email },
      });
    }

    const accessToken = signAccessToken(result.user.id);
    setAccessTokenCookie(res, accessToken);

    return res.jsonSuccess({
      requires2fa: false,
      user: result.user,
    });
  } catch (error: any) {
    const msg = String(error?.message ?? "");
    if (
      msg.toLowerCase().includes("invalid credentials") ||
      msg.toLowerCase().includes("bad credentials") ||
      msg.toLowerCase().includes("unauthorized")
    ) {
      return res.jsonError("Invalid credentials", 401);
    }

    next(error);
  }
};

export const init2fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body ?? {};
    if (!userId) return res.jsonError("Missing userId", 400);

    const userRepo = new UserRepositoryPrisma();
    const usecase = new Init2FaUseCase(userRepo);

    const result = await usecase.execute(userId);
    return res.jsonSuccess(result);
  } catch (e) {
    next(e);
  }
};

export const confirm2fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body ?? {};
    if (!userId || !token) return res.jsonError("Missing userId or token", 400);

    const userRepo = new UserRepositoryPrisma();
    const backupRepo = new OtpBackupCodeRepositoryPrisma();
    const usecase = new Confirm2FaUseCase(userRepo, backupRepo);

    const result = await usecase.execute(userId, token);
    return res.jsonSuccess(result);
  } catch (e) {
    next(e);
  }
};

export const verify2fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pendingToken, token } = req.body ?? {};
    if (!pendingToken || !token) {
      return res.jsonError("Missing pendingToken or token", 400);
    }

    const userId = verifyPending2faToken(pendingToken);

    const userRepo = new UserRepositoryPrisma();
    const usecase = new Verify2FaUseCase(userRepo);

    const result = await usecase.execute(userId, token);
    if (!result?.ok) return res.jsonError("CONNECTION_2AF_INVALID", 401);

    const accessToken = signAccessToken(userId);
    setAccessTokenCookie(res, accessToken);

    return res.jsonSuccess({ ok: true });
  } catch (e) {
    next(e);
  }
};

export const backup2fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pendingToken, code } = req.body ?? {};
    if (!pendingToken || !code) {
      return res.jsonError("Missing pendingToken or code", 400);
    }

    const userId = verifyPending2faToken(pendingToken);

    const userRepo = new UserRepositoryPrisma();
    const backupRepo = new OtpBackupCodeRepositoryPrisma();
    const usecase = new UseBackupCodeUseCase(userRepo, backupRepo);

    const result = await usecase.execute(userId, code);
    if (!result?.ok) return res.jsonError("CONNECTION_2AF_INVALID", 401);

    const accessToken = signAccessToken(userId);
    setAccessTokenCookie(res, accessToken);

    return res.jsonSuccess({ ok: true });
  } catch (e) {
    next(e);
  }
};

export const disable2fa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body ?? {};
    if (!userId) return res.jsonError("Missing userId", 400);

    const userRepo = new UserRepositoryPrisma();
    const backupRepo = new OtpBackupCodeRepositoryPrisma();
    const usecase = new Disable2FaUseCase(userRepo, backupRepo);

    const result = await usecase.execute(userId);
    return res.jsonSuccess(result);
  } catch (e) {
    next(e);
  }
};