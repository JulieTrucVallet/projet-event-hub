import { CreateEventUseCase } from "../src/application/usecases/create-event.usecase";
import { EventRepositoryInMemory } from "./inmemory/event.repository.inmemory";

describe("CreateEventUseCase", () => {
  let repository: EventRepositoryInMemory;
  let usecase: CreateEventUseCase;

  beforeEach(() => {
    repository = new EventRepositoryInMemory();
    usecase = new CreateEventUseCase(repository);
  });

  const futureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString();
  };

  describe("Scenario: payload is valid", () => {
    it("should create an event and return its id", async () => {
      const result = await usecase.execute({
        title: "Conférence Tech",
        description: "Une conférence sur les nouveautés",
        startDate: futureDate(),
        venueId: "venue-1",
        capacity: 100,
        price: 20,
        organizerId: "user-1",
        categoryId: "cat-tech",
        imageUrl: "https://example.com/image.jpg",
      });

      expect(result.id).toBeDefined();
      expect(repository.events.length).toBe(1);
    });
  });

  describe("Scenario: title is empty", () => {
    it("should throw an error", async () => {
      await expect(() =>
        usecase.execute({
          title: "",
          startDate: futureDate(),
          venueId: "venue-1",
          capacity: 10,
          organizerId: "user-1",
          categoryId: "cat-tech",
        } as any)
      ).rejects.toThrow("Event title cannot be empty");
    });
  });

  describe("Scenario: start date is in the past", () => {
    it("should throw an error", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await expect(() =>
        usecase.execute({
          title: "Event passé",
          startDate: pastDate.toISOString(),
          venueId: "venue-1",
          capacity: 10,
          organizerId: "user-1",
          categoryId: "cat-tech",
        } as any)
      ).rejects.toThrow("Event start date must be in the future");
    });
  });

  describe("Scenario: category does not exist", () => {
    it("should throw an error", async () => {
      await expect(() =>
        usecase.execute({
          title: "Event",
          startDate: futureDate(),
          venueId: "venue-1",
          capacity: 10,
          organizerId: "user-1",
          categoryId: "cat-unknown",
        } as any)
      ).rejects.toThrow("Event category does not exist");
    });
  });
});