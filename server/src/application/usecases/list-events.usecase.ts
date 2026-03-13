import type { IEventRepository } from "../../domain/interfaces/event-repository.interface";

export class ListEventsUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute() {
    const events = await this.eventRepository.findAll();
    return events.map((e) => e.props);
  }
}