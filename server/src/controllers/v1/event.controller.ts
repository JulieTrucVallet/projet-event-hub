import type { NextFunction, Request, Response } from "express";
import { CreateEventUseCase } from "../../application/usecases/create-event.usecase";
import { DeleteEventUseCase } from "../../application/usecases/delete-event.usecase";
import { GetEventByIdUseCase } from "../../application/usecases/get-event-by-id.usecase";
import { ListEventsUseCase } from "../../application/usecases/list-events.usecase";
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
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const repository = new EventRepositoryPrisma();
    const usecase = new ListEventsUseCase(repository);

    const result = await usecase.execute();

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