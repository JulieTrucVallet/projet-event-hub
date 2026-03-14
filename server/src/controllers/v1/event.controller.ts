import type { NextFunction, Request, Response } from "express";
import { CreateEventUseCase } from "../../application/usecases/create-event.usecase";
import { DeleteEventUseCase } from "../../application/usecases/delete-event.usecase";
import { GetEventByIdUseCase } from "../../application/usecases/get-event-by-id.usecase";
import { UpdateEventUseCase } from "../../application/usecases/update-event.usecase";
import { EventRepositoryPrisma } from "../../infrastructure/repositories/event-repository.prisma";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const repository = new EventRepositoryPrisma();
    const usecase = new CreateEventUseCase(repository);

    const result = await usecase.execute(req.body);

    return res.jsonSuccess(result, 201);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const repository = new EventRepositoryPrisma();

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 5);

      const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
      const safeLimit = Number.isNaN(limit) || limit < 1 ? 5 : limit;

      const result = await repository.findPaginated(safePage, safeLimit);

      return res.jsonSuccess(result);
    } catch (error) {
      next(error);
    }
  };

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const repository = new EventRepositoryPrisma();
    const usecase = new GetEventByIdUseCase(repository);

    const id = req.params.id as string;
    if (!id) {
      return res.jsonError("Missing event id", 400);
    }
    const result = await usecase.execute(id);

    return res.jsonSuccess(result);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const repository = new EventRepositoryPrisma();
    const usecase = new DeleteEventUseCase(repository);

    const id = req.params.id as string;
    if (!id) return res.jsonError("Missing event id", 400);

    await usecase.execute(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const repository = new EventRepositoryPrisma();
    const usecase = new UpdateEventUseCase(repository);

    const id = req.params.id as string;
    if (!id) {
      return res.jsonError("Missing event id", 400);
    }

    const result = await usecase.execute(id, req.body);

    return res.jsonSuccess(result);
  } catch (error) {
    next(error);
  }
};