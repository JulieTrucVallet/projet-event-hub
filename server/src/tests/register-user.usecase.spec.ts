import { RegisterUserUseCase } from "../application/usecases/register-user.usecase";
import { UserRepositoryInMemory } from "./inmemory/user.repository.inmemory";

describe("RegisterUserUseCase", () => {
  let repository: UserRepositoryInMemory;
  let usecase: RegisterUserUseCase;

  beforeEach(() => {
    repository = new UserRepositoryInMemory();
    usecase = new RegisterUserUseCase(repository);
  });

  describe("Scenario: payload is valid", () => {
    it("should create a user and return its id", async () => {
      const result = await usecase.execute({
        firstname: "Julie",
        lastname: "Truc-Vallet",
        email: "julie@mail.com",
        password: "password123",
      });

      expect(result.id).toBeDefined();
      expect(repository.users.length).toBe(1);
    });
  });

  describe("Scenario: missing fields", () => {
    it("should throw an error", async () => {
      await expect(() =>
        usecase.execute({
          firstname: "",
          lastname: "Truc",
          email: "test@mail.com",
          password: "123",
        })
      ).rejects.toThrow("Missing required fields");
    });
  });

  describe("Scenario: email already used", () => {
    it("should throw an error", async () => {
      await usecase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "julie@mail.com",
        password: "password123",
      });

      await expect(() =>
        usecase.execute({
          firstname: "Julie2",
          lastname: "Truc2",
          email: "julie@mail.com",
          password: "password123",
        })
      ).rejects.toThrow("Email already used");
    });
  });

  describe("Scenario: email normalization", () => {
    it("should store email in lowercase", async () => {
      await usecase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "JULIE@MAIL.COM",
        password: "password123",
      });

      const user = repository.users[0];

      expect(user).toBeDefined();
      expect(user!.email).toBe("julie@mail.com");
    });
  });

  describe("Scenario: password is hashed", () => {
    it("should not store plain password", async () => {
      await usecase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "julie@mail.com",
        password: "password123",
      });

      const user = repository.users[0];

      expect(user).toBeDefined();
      expect(user!.passwordHash).not.toBe("password123");
      expect(user!.passwordHash.length).toBeGreaterThan(10);
    });
  });
});