import { User } from "../domain/entities/user.entity";

describe("User Entity", () => {
  const validProps = {
    id: "user-1",
    firstname: "Julie",
    lastname: "Truc-Vallet",
    email: "julie@mail.com",
    passwordHash: "hashed-password",
    otpEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("Scenario: props are valid", () => {
    it("should create a valid user", () => {
      const user = User.create(validProps);

      expect(user).toBeDefined();
      expect(user.id).toBe("user-1");
      expect(user.firstname).toBe("Julie");
      expect(user.lastname).toBe("Truc-Vallet");
      expect(user.email).toBe("julie@mail.com");
      expect(user.passwordHash).toBe("hashed-password");
      expect(user.otpEnabled).toBe(false);
    });
  });

  describe("Scenario: firstname is empty", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          firstname: "",
        })
      ).toThrow("User firstname cannot be empty");
    });
  });

  describe("Scenario: lastname is empty", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          lastname: "",
        })
      ).toThrow("User lastname cannot be empty");
    });
  });

  describe("Scenario: email is empty", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          email: "",
        })
      ).toThrow("User email cannot be empty");
    });
  });

  describe("Scenario: email is invalid", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          email: "julie-mail.com",
        })
      ).toThrow("User email is invalid");
    });
  });

  describe("Scenario: password hash is empty", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          passwordHash: "",
        })
      ).toThrow("User password hash cannot be empty");
    });
  });

  describe("Scenario: otp is enabled without secret", () => {
    it("should throw an error", () => {
      expect(() =>
        User.create({
          ...validProps,
          otpEnabled: true,
          otpSecret: "",
        })
      ).toThrow("OTP secret is required when 2FA is enabled");
    });
  });

  describe("Scenario: otp is enabled with secret", () => {
    it("should create the user", () => {
      const user = User.create({
        ...validProps,
        otpEnabled: true,
        otpSecret: "MY_SECRET",
      });

      expect(user.otpEnabled).toBe(true);
      expect(user.otpSecret).toBe("MY_SECRET");
    });
  });
});