import { Event } from "../domain/entities/event.entity";

describe("Cancel Event", () => {
  const futureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  };

  const pastDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    return date;
  };

  const createValidFutureEvent = () =>
    Event.create({
      id: "event-1",
      title: "Conférence Tech",
      description: "Une super conférence",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 100,
      price: 20,
      organizerId: "user-1",
      categoryId: "cat-tech",
      imageUrl: "https://example.com/image.jpg",
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createCancelledEvent = () =>
    Event.create({
      id: "event-2",
      title: "Event annulé",
      description: "Déjà annulé",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 100,
      price: 20,
      organizerId: "user-1",
      categoryId: "cat-tech",
      imageUrl: "https://example.com/image.jpg",
      status: "cancelled",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const createPastEvent = () =>
    Event.create({
      id: "event-3",
      title: "Event passé",
      description: "Déjà passé",
      startDate: pastDate(),
      venueId: "venue-1",
      capacity: 100,
      price: 20,
      organizerId: "user-1",
      categoryId: "cat-tech",
      imageUrl: "https://example.com/image.jpg",
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  it("should change status to cancelled", () => {
    const event = createValidFutureEvent();

    event.cancel("user-1");

    expect(event.status).toBe("cancelled");
  });

  it("should throw if user is not the organizer", () => {
    const event = createValidFutureEvent();

    expect(() => event.cancel("other-user")).toThrow(
      "Only the organizer can cancel this event"
    );
  });

  it("should throw if event is already cancelled", () => {
    const event = createCancelledEvent();

    expect(() => event.cancel("user-1")).toThrow(
      "Event is already cancelled"
    );
  });

  it("should throw if event is in the past", () => {
    const event = createPastEvent();

    expect(() => event.cancel("user-1")).toThrow(
      "Cannot cancel a past event"
    );
  });
});