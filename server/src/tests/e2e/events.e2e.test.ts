import { randomUUID } from "node:crypto";
import { disconnectPrismaClient, getPrismaClient } from "../../prisma/client";
import { startTestDatabase, stopTestDatabase } from "./setup-e2e";
import { getTestApp } from "./test-app";

jest.setTimeout(60000);

describe("Events e2e", () => {
  beforeAll(async () => {
    await startTestDatabase();
  });

  beforeEach(async () => {
    const prisma = getPrismaClient();

    await prisma.event.deleteMany();
    await prisma.otpBackupCode.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await prisma.venue.deleteMany();
  });

  afterAll(async () => {
    await disconnectPrismaClient();
    await stopTestDatabase();
  });

  it("should create an event", async () => {
    const prisma = getPrismaClient();

    const registerRes = await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Organizer",
        email: "organizer@test.com",
        password: "Test1234!",
      });

    const organizerId = registerRes.body.data.id;

    const category = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: "Music",
      },
    });

    const venue = await prisma.venue.create({
      data: {
        id: randomUUID(),
        name: "Salle 1",
        address: "1 rue de Paris",
        city: "Paris",
      },
    });

    const futureDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const res = await getTestApp()
      .post("/api/v1/events")
      .send({
        title: "Concert Test",
        description: "Un super concert",
        startDate: futureDate,
        venueId: venue.id,
        capacity: 100,
        price: 25,
        organizerId,
        categoryId: category.id,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });

  it("should return 500 if category does not exist", async () => {
    const prisma = getPrismaClient();

    const registerRes = await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Organizer",
        email: "organizer@test.com",
        password: "Test1234!",
      });

    const organizerId = registerRes.body.data.id;

    const venue = await prisma.venue.create({
      data: {
        id: randomUUID(),
        name: "Salle 1",
        address: "1 rue de Paris",
        city: "Paris",
      },
    });

    const futureDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const res = await getTestApp()
      .post("/api/v1/events")
      .send({
        title: "Concert Test",
        description: "Un super concert",
        startDate: futureDate,
        venueId: venue.id,
        capacity: 100,
        price: 25,
        organizerId,
        categoryId: randomUUID(),
      });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain("Event category does not exist");
  });

  it("should list events with pagination data", async () => {
    const prisma = getPrismaClient();

    const registerRes = await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Organizer",
        email: "organizer@test.com",
        password: "Test1234!",
      });

    const organizerId = registerRes.body.data.id;

    const category = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: "Music",
      },
    });

    const venue = await prisma.venue.create({
      data: {
        id: randomUUID(),
        name: "Salle 1",
        address: "1 rue de Paris",
        city: "Paris",
      },
    });

    const futureDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    await getTestApp()
      .post("/api/v1/events")
      .send({
        title: "Concert Test 1",
        startDate: futureDate,
        venueId: venue.id,
        capacity: 100,
        organizerId,
        categoryId: category.id,
      });

    await getTestApp()
      .post("/api/v1/events")
      .send({
        title: "Concert Test 2",
        startDate: futureDate,
        venueId: venue.id,
        capacity: 80,
        organizerId,
        categoryId: category.id,
      });

    const res = await getTestApp().get("/api/v1/events?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 5,
        totalPages: expect.any(Number),
      })
    );
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it("should return an event by id", async () => {
    const prisma = getPrismaClient();

    const registerRes = await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Organizer",
        email: "organizer@test.com",
        password: "Test1234!",
      });

    const organizerId = registerRes.body.data.id;

    const category = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: "Music",
      },
    });

    const venue = await prisma.venue.create({
      data: {
        id: randomUUID(),
        name: "Salle 1",
        address: "1 rue de Paris",
        city: "Paris",
      },
    });

    const futureDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const createRes = await getTestApp()
      .post("/api/v1/events")
      .send({
        title: "Concert Detail",
        description: "Détail concert",
        startDate: futureDate,
        venueId: venue.id,
        capacity: 100,
        organizerId,
        categoryId: category.id,
      });

    const eventId = createRes.body.data.id;

    const res = await getTestApp().get(`/api/v1/events/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: eventId,
        title: "Concert Detail",
        organizerId,
        categoryId: category.id,
        venueId: venue.id,
      })
    );
  });
});