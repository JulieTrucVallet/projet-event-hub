import type { IEventRepository } from "../../domain/interfaces/event-repository.interface";

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  startDate?: string;
  capacity?: number;
  price?: number;
  imageUrl?: string;
}

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(id: string, payload: UpdateEventPayload) {
    const startDate =
      payload.startDate !== undefined ? new Date(payload.startDate) : undefined;

    if (startDate !== undefined && startDate <= new Date()) {
      throw new Error("Event start date must be in the future");
    }

    const data = {
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(startDate !== undefined ? { startDate } : {}),
      ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
      ...(payload.price !== undefined ? { price: payload.price } : {}),
      ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
    };

    const updated = await this.eventRepository.updateById(id, data);

    if (!updated) {
      throw new Error("Event not found");
    }

    return updated.props;
  }
}