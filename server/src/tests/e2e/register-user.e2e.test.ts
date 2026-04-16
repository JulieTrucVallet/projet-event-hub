import { disconnectPrismaClient, getPrismaClient } from "../../prisma/client";
import { startTestDatabase, stopTestDatabase } from "./setup-e2e";
import { getTestApp } from "./test-app";

jest.setTimeout(60000);

describe("POST /api/v1/auth/register", () => {
  beforeAll(async () => {
    await startTestDatabase();
  });

  beforeEach(async () => {
    const prisma = getPrismaClient();

    await prisma.otpBackupCode.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await disconnectPrismaClient();
    await stopTestDatabase();
  });

  it("should register a user", async () => {
    const res = await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Test",
        email: "julie@test.com",
        password: "Test1234!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });
});