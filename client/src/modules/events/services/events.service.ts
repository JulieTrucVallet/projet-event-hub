export type EventItem = {
  props: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    venueId: string;
    capacity: number;
    price?: number;
    organizerId: string;
    categoryId: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type PaginatedEventsResponse = {
  items: EventItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class EventsService {
  private baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

  async getPaginatedEvents(page: number, limit: number): Promise<PaginatedEventsResponse> {
    const response = await fetch(`${this.baseUrl}/events?page=${page}&limit=${limit}`);

    const json = await response.json();

    if (!response.ok || json.success === false) {
      throw new Error(json?.error?.message ?? "Erreur lors du chargement des événements");
    }

    return json.data as PaginatedEventsResponse;
  }
}