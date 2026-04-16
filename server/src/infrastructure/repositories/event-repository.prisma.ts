import { Event } from "../../domain/entities/event.entity";
import { IEventRepository } from "../../domain/interfaces/event-repository.interface";
import { getPrismaClient } from "../../prisma/client";

export class EventRepositoryPrisma implements IEventRepository {
  async save(event: Event): Promise<Event> {
    const prisma = getPrismaClient();

    const created = await prisma.event.create({
      data: {
        id: event.props.id,
        title: event.props.title,
        startDate: event.props.startDate,
        capacity: event.props.capacity,
        organizerId: event.props.organizerId,
        categoryId: event.props.categoryId,
        venueId: event.props.venueId,
        status: event.props.status,
        ...(event.props.description !== undefined ? { description: event.props.description } : {}),
        ...(event.props.price !== undefined ? { price: event.props.price } : {}),
        ...(event.props.imageUrl !== undefined ? { imageUrl: event.props.imageUrl } : {}),
      },
    });

    return Event.create({
      id: created.id,
      title: created.title,
      startDate: created.startDate,
      venueId: created.venueId,
      capacity: created.capacity,
      organizerId: created.organizerId,
      categoryId: created.categoryId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      status: created.status,
      ...(created.description !== null ? { description: created.description } : {}),
      ...(created.price !== null ? { price: created.price } : {}),
      ...(created.imageUrl !== null ? { imageUrl: created.imageUrl } : {}),
    });
  }

  async categoryExists(categoryId: string): Promise<boolean> {
    const prisma = getPrismaClient();

    const found = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    return !!found;
  }

  async findAll(): Promise<Event[]> {
    const prisma = getPrismaClient();

    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    return events.map((e) =>
      Event.create({
        id: e.id,
        title: e.title,
        startDate: e.startDate,
        venueId: e.venueId,
        capacity: e.capacity,
        organizerId: e.organizerId,
        categoryId: e.categoryId,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        status: e.status,
        ...(e.description !== null ? { description: e.description } : {}),
        ...(e.price !== null ? { price: e.price } : {}),
        ...(e.imageUrl !== null ? { imageUrl: e.imageUrl } : {}),
      })
    );
  }

  async findPaginated(
    page: number,
    limit: number
  ): Promise<{
    items: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.event.count(),
    ]);

    const items = events.map((e) =>
      Event.create({
        id: e.id,
        title: e.title,
        startDate: e.startDate,
        venueId: e.venueId,
        capacity: e.capacity,
        organizerId: e.organizerId,
        categoryId: e.categoryId,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        status: e.status,
        ...(e.description !== null ? { description: e.description } : {}),
        ...(e.price !== null ? { price: e.price } : {}),
        ...(e.imageUrl !== null ? { imageUrl: e.imageUrl } : {}),
      })
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Event | null> {
    const prisma = getPrismaClient();

    const e = await prisma.event.findUnique({
      where: { id },
    });

    if (!e) return null;

    return Event.create({
      id: e.id,
      title: e.title,
      startDate: e.startDate,
      venueId: e.venueId,
      capacity: e.capacity,
      organizerId: e.organizerId,
      categoryId: e.categoryId,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      status: e.status,
      ...(e.description !== null ? { description: e.description } : {}),
      ...(e.price !== null ? { price: e.price } : {}),
      ...(e.imageUrl !== null ? { imageUrl: e.imageUrl } : {}),
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    const found = await prisma.event.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!found) return false;

    await prisma.event.delete({ where: { id } });
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
    const prisma = getPrismaClient();

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
        ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      },
    });

    return Event.create({
      id: updated.id,
      title: updated.title,
      startDate: updated.startDate,
      venueId: updated.venueId,
      capacity: updated.capacity,
      organizerId: updated.organizerId,
      categoryId: updated.categoryId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      status: updated.status,
      ...(updated.description !== null ? { description: updated.description } : {}),
      ...(updated.price !== null ? { price: updated.price } : {}),
      ...(updated.imageUrl !== null ? { imageUrl: updated.imageUrl } : {}),
    });
  }
}