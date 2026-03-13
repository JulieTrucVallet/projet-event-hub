import { CreateEventUseCase } from "../src/application/usecases/create-event.usecase";
import { DeleteEventUseCase } from "../src/application/usecases/delete-event.usecase";
import { EventRepositoryInMemory } from "./inmemory/event.repository.inmemory";

describe("DeleteEventUseCase", () => {
  let createUseCase: CreateEventUseCase;
  let deleteUseCase: DeleteEventUseCase;
  let repository: EventRepositoryInMemory;

  beforeEach(() => {
    repository = new EventRepositoryInMemory();
    createUseCase = new CreateEventUseCase(repository);
    deleteUseCase = new DeleteEventUseCase(repository);
  });

  describe("Scenario: event does not exist", () => {
    it("should throw an error", async () => {
      await expect(() => deleteUseCase.execute("unknown-id")).rejects.toThrow("Event not found");
    });
  });

  describe("Scenario: event exists", () => {
    it("should delete the event", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const created = await createUseCase.execute({
        title: "Event to delete",
        startDate: futureDate.toISOString(),
        venueId: "venue-1",
        capacity: 10,
        organizerId: "user-1",
        categoryId: "cat-tech",
      });

      expect(repository.events.length).toBe(1);

      await deleteUseCase.execute(created.id);

      expect(repository.events.length).toBe(0);
    });
  });
});