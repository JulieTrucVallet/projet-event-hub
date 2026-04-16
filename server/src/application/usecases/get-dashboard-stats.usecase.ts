import { getPrismaClient } from "../../prisma/client";

export type DashboardStats = {
  totals: {
    users: number;
    events: number;
    upcomingEvents: number;
    pastEvents: number;
    twoFaEnabledUsers: number;
  };
  eventsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  eventsByMonth: Array<{
    month: string;
    count: number;
  }>;
};

export class GetDashboardStatsUseCase {
  async execute(): Promise<DashboardStats> {
    const prisma = getPrismaClient();
    const now = new Date();

    const [
      usersCount,
      eventsCount,
      upcomingEventsCount,
      pastEventsCount,
      twoFaEnabledUsersCount,
      categories,
      events,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.event.count({
        where: {
          startDate: {
            gte: now,
          },
        },
      }),
      prisma.event.count({
        where: {
          startDate: {
            lt: now,
          },
        },
      }),
      prisma.user.count({
        where: {
          otpEnabled: true,
        },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.event.findMany({
        select: {
          startDate: true,
        },
        orderBy: {
          startDate: "asc",
        },
      }),
    ]);

    const eventsByCategory = categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      count: category._count.events,
    }));

    const monthMap = new Map<string, number>();

    for (const event of events) {
      const year = event.startDate.getFullYear();
      const month = String(event.startDate.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;

      monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
    }

    const eventsByMonth = Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
    }));

    return {
      totals: {
        users: usersCount,
        events: eventsCount,
        upcomingEvents: upcomingEventsCount,
        pastEvents: pastEventsCount,
        twoFaEnabledUsers: twoFaEnabledUsersCount,
      },
      eventsByCategory,
      eventsByMonth,
    };
  }
}