import type { NextFunction, Request, Response } from "express";

type JsonSuccess = (data: unknown, status?: number) => Response;
type JsonError = (message: string, status?: number, details?: unknown) => Response;

declare global {
  namespace Express {
    interface Response {
      jsonSuccess: JsonSuccess;
      jsonError: JsonError;
    }
  }
}

export const jsonApiResponseMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.jsonSuccess = (data: unknown, status = 200) => {
    return res.status(status).json({ success: true, data });
  };

  res.jsonError = (message: string, status = 400, details?: unknown) => {
    return res.status(status).json({
      success: false,
      error: { message, ...(details ? { details } : {}) },
    });
  };

  next();
};