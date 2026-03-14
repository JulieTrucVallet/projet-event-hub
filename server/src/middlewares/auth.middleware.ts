import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utility/jwt.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.jsonError("Unauthorized", 401);
  }

  try {
    const userId = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch (e) {
    return res.jsonError("Invalid access token", 401);
  }
}