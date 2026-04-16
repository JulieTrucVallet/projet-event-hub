import { disconnectPrismaClient, getPrismaClient } from "../../prisma/client";
import { startTestDatabase, stopTestDatabase } from "./setup-e2e";
import { getTestApp } from "./test-app";

jest.setTimeout(60000);

describe("GET /api/v1/users/me", () => {
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

  it("should return current user when authenticated", async () => {
    const agent = getTestApp();

    await agent.post("/api/v1/auth/register").send({
      firstname: "Julie",
      lastname: "Test",
      email: "julie@test.com",
      password: "password123",
    });

    const loginRes = await agent.post("/api/v1/auth/login").send({
      email: "julie@test.com",
      password: "password123",
    });

    const cookies = loginRes.headers["set-cookie"];

    if (!cookies) {
      throw new Error("Missing auth cookie after login");
    }

    const res = await agent
      .get("/api/v1/users/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body.data).toEqual(
      expect.objectContaining({
        email: "julie@test.com",
        firstname: "Julie",
        lastname: "Test",
      })
    );
  });

  it("should fail without authentication", async () => {
    const res = await getTestApp().get("/api/v1/users/me");

    expect(res.status).toBe(401);
  });
});