import { disconnectPrismaClient, getPrismaClient } from "../../prisma/client";
import { startTestDatabase, stopTestDatabase } from "./setup-e2e";
import { getTestApp } from "./test-app";

jest.setTimeout(60000);

describe("POST /api/v1/auth/login", () => {
  beforeAll(async () => {
    await startTestDatabase();
  });

  beforeEach(async () => {
    const prisma = getPrismaClient();

    await prisma.otpBackupCode.deleteMany();
    await prisma.user.deleteMany();

    // 👇 on crée un user pour tester le login
    await getTestApp()
      .post("/api/v1/auth/register")
      .send({
        firstname: "Julie",
        lastname: "Test",
        email: "julie@test.com",
        password: "password123",
      });
  });

  afterAll(async () => {
    await disconnectPrismaClient();
    await stopTestDatabase();
  });

  it("should login a user without 2FA", async () => {
    const res = await getTestApp()
      .post("/api/v1/auth/login")
      .send({
        email: "julie@test.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body.data).toEqual(
      expect.objectContaining({
        requires2fa: false,
        user: expect.objectContaining({
          id: expect.any(String),
          email: "julie@test.com",
        }),
      })
    );

    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await getTestApp()
      .post("/api/v1/auth/login")
      .send({
        email: "julie@test.com",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});