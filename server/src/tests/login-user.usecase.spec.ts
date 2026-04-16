import { LoginUserUseCase } from "../application/usecases/login-user.usecase";
import { RegisterUserUseCase } from "../application/usecases/register-user.usecase";
import { UserRepositoryInMemory } from "./inmemory/user.repository.inmemory";

describe("LoginUserUseCase", () => {
  let repository: UserRepositoryInMemory;
  let loginUseCase: LoginUserUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    repository = new UserRepositoryInMemory();
    loginUseCase = new LoginUserUseCase(repository);
    registerUseCase = new RegisterUserUseCase(repository);
  });

  describe("Scenario: login success", () => {
    it("should return user data", async () => {
      await registerUseCase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "julie@mail.com",
        password: "password123",
      });

      const result = await loginUseCase.execute({
        email: "julie@mail.com",
        password: "password123",
      });

      expect(result.user.email).toBe("julie@mail.com");
      expect(result.requires2fa).toBe(false);
    });
  });

  describe("Scenario: email does not exist", () => {
    it("should throw an error", async () => {
      await expect(() =>
        loginUseCase.execute({
          email: "unknown@mail.com",
          password: "password123",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("Scenario: wrong password", () => {
    it("should throw an error", async () => {
      await registerUseCase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "julie@mail.com",
        password: "password123",
      });

      await expect(() =>
        loginUseCase.execute({
          email: "julie@mail.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("Scenario: missing credentials", () => {
    it("should throw an error", async () => {
      await expect(() =>
        loginUseCase.execute({
          email: "",
          password: "",
        })
      ).rejects.toThrow("Missing credentials");
    });
  });

  describe("Scenario: 2FA enabled", () => {
    it("should return requires2fa = true", async () => {
        await registerUseCase.execute({
        firstname: "Julie",
        lastname: "Truc",
        email: "julie@mail.com",
        password: "password123",
        });

        const user = repository.users[0];
        expect(user).toBeDefined();

        await repository.setOtpSecret(user!.id, "MY_OTP_SECRET");
        await repository.setOtpEnabled(user!.id, true);

        const result = await loginUseCase.execute({
        email: "julie@mail.com",
        password: "password123",
        });

        expect(result.requires2fa).toBe(true);
    });
    });
});