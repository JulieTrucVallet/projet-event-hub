import { Event } from "../domain/entities/event.entity";

describe("Event Entity", () => {
  const futureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  };

  const validProps = {
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
    status: "scheduled" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("Scenario: props are valid", () => {
    it("should create a valid event", () => {
      const event = Event.create(validProps);

      expect(event).toBeDefined();
      expect(event.id).toBe("event-1");
      expect(event.title).toBe("Conférence Tech");
      expect(event.capacity).toBe(100);
      expect(event.price).toBe(20);
      expect(event.status).toBe("scheduled");
    });
  });

  describe("Scenario: title is empty", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          title: "",
        })
      ).toThrow("Event title cannot be empty");
    });
  });

  describe("Scenario: venueId is missing", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          venueId: "",
        })
      ).toThrow("Event venue is required");
    });
  });

  describe("Scenario: capacity is less than 1", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          capacity: 0,
        })
      ).toThrow("Event capacity must be at least 1");
    });
  });

  describe("Scenario: organizerId is missing", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          organizerId: "",
        })
      ).toThrow("Event organizer is required");
    });
  });

  describe("Scenario: categoryId is missing", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          categoryId: "",
        })
      ).toThrow("Event category is required");
    });
  });

  describe("Scenario: price is negative", () => {
    it("should throw an error", () => {
      expect(() =>
        Event.create({
          ...validProps,
          price: -10,
        })
      ).toThrow("Event price must be a positive number");
    });
  });

  describe("Scenario: price is omitted", () => {
    it("should create the event", () => {
      const { price, ...propsWithoutPrice } = validProps;

      const event = Event.create(propsWithoutPrice);

      expect(event).toBeDefined();
      expect(event.price).toBeUndefined();
    });
  });
});