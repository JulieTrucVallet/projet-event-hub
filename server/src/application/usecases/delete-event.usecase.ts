import type { IEventRepository } from "../../domain/interfaces/event-repository.interface";

export class DeleteEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(id: string) {
    const deleted = await this.eventRepository.deleteById(id);
    if (!deleted) {
      throw new Error("Event not found");
    }
    return true;
  }
}