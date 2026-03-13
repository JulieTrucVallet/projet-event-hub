import type { NextFunction, Request, Response } from "express";

type HttpError = Error & { statusCode?: number; details?: unknown };

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  const e = err as HttpError;
  const status = e?.statusCode ?? 500;
  const message = e instanceof Error ? e.message : "Internal server error";

  return res.jsonError(message, status, e?.details);
};