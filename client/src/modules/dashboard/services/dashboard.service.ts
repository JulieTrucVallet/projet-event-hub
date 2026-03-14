export type DashboardData = {
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

export class DashboardService {
  private baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

  async getStats(): Promise<DashboardData> {
    const response = await fetch(`${this.baseUrl}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok || json?.success === false) {
      throw new Error(json?.error?.message ?? "Impossible de charger le dashboard");
    }

    return json.data as DashboardData;
  }
}