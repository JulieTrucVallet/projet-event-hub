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
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.jsonError("Missing Authorization bearer token", 401);
  }

  const token = auth.slice("Bearer ".length).trim();

  try {
    const userId = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch (e) {
    return res.jsonError("Invalid access token", 401);
  }
}