import { Event } from "../entities/event.entity";

export interface IEventRepository {
  save(event: Event): Promise<Event>;
  categoryExists(categoryId: string): Promise<boolean>;
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  deleteById(id: string): Promise<boolean>;
  updateById(
    id: string,
    data: {
      title?: string;
      description?: string;
      startDate?: Date;
      capacity?: number;
      price?: number;
      imageUrl?: string;
    }
  ): Promise<Event | null>;
}