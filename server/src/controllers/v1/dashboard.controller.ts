import type { NextFunction, Request, Response } from "express";
import { GetDashboardStatsUseCase } from "../../application/usecases/get-dashboard-stats.usecase";

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const usecase = new GetDashboardStatsUseCase();
    const result = await usecase.execute();

    return res.jsonSuccess(result);
  } catch (error) {
    next(error);
  }
};