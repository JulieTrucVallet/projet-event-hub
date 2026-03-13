import { CreateEventUseCase } from "../src/application/usecases/create-event.usecase";
import { UpdateEventUseCase } from "../src/application/usecases/update-event.usecase";
import { EventRepositoryInMemory } from "./inmemory/event.repository.inmemory";

describe("UpdateEventUseCase", () => {
  let createUseCase: CreateEventUseCase;
  let updateUseCase: UpdateEventUseCase;
  let repository: EventRepositoryInMemory;

  beforeEach(() => {
    repository = new EventRepositoryInMemory();
    createUseCase = new CreateEventUseCase(repository);
    updateUseCase = new UpdateEventUseCase(repository);
  });

  const createValidEvent = async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    return createUseCase.execute({
      title: "Event before update",
      startDate: futureDate.toISOString(),
      venueId: "venue-1",
      capacity: 10,
      organizerId: "user-1",
      categoryId: "cat-tech",
    });
  };

  describe("Scenario: event does not exist", () => {
    it("should throw an error", async () => {
      await expect(() =>
        updateUseCase.execute("unknown-id", { title: "New title" })
      ).rejects.toThrow("Event not found");
    });
  });

  describe("Scenario: startDate in the past", () => {
    it("should throw an error", async () => {
      const created = await createValidEvent();

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await expect(() =>
        updateUseCase.execute(created.id, { startDate: pastDate.toISOString() })
      ).rejects.toThrow("Event start date must be in the future");
    });
  });

  describe("Scenario: payload is valid", () => {
    it("should update the event", async () => {
      const created = await createValidEvent();

      const updated = await updateUseCase.execute(created.id, {
        title: "Event UPDATED",
        price: 30,
      });

      expect(updated.title).toEqual("Event UPDATED");
      expect(updated.price).toEqual(30);
    });
  });
});