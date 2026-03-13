import type { IEventRepository } from "../../domain/interfaces/event-repository.interface";

export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(id: string) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event.props;
  }
}