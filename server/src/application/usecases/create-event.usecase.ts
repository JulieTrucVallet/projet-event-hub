import { randomUUID } from "crypto";
import { Event } from "../../domain/entities/event.entity";
import type { IEventRepository } from "../../domain/interfaces/event-repository.interface";

export interface CreateEventPayload {
  title: string;
  description?: string;
  startDate: string;
  venueId: string;
  capacity: number;
  price?: number;
  organizerId: string;
  categoryId: string;
  imageUrl?: string;
}

export class CreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(payload: CreateEventPayload): Promise<{ id: string }> {
    const categoryExists = await this.eventRepository.categoryExists(payload.categoryId);
    if (!categoryExists) {
      throw new Error("Event category does not exist");
    }

    const event = Event.create({
        id: randomUUID(),
        title: payload.title,
        startDate: new Date(payload.startDate),
        venueId: payload.venueId,
        capacity: payload.capacity,
        organizerId: payload.organizerId,
        categoryId: payload.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),

        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.price !== undefined ? { price: payload.price } : {}),
        ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
    });


    const saved = await this.eventRepository.save(event);

    return { id: saved.id };
  }
}