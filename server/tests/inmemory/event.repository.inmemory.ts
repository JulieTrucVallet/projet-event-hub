import { Event } from "../../src/domain/entities/event.entity";
import type { IEventRepository } from "../../src/domain/interfaces/event-repository.interface";

export class EventRepositoryInMemory implements IEventRepository {
  public events: Event[] = [];

  private categories = new Set<string>(["cat-music", "cat-tech", "cat-sport"]);

  async save(event: Event): Promise<Event> {
    this.events.push(event);
    return event;
  }

  async categoryExists(categoryId: string): Promise<boolean> {
    return this.categories.has(categoryId);
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find((e) => e.props.id === id) ?? null;
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.events.findIndex((e) => e.props.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    return true;
  }

  async updateById(
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      capacity?: number;
      price?: number;
      imageUrl?: string;
    }
  ): Promise<Event | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedProps = {
      ...existing.props,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      updatedAt: new Date(),
    };

    const updated = Event.create(updatedProps);
    this.events = this.events.map((e) => (e.props.id === id ? updated : e));
    return updated;
  }
}