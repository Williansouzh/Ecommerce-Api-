import AuthService from "@src/application/services/authService"; // ajuste o caminho conforme necessário
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  const password = "testPassword123!";
  const hashedPassword = "$2b$10$exampleHashHere";
  const payload = { userId: "12345", email: "test@example.com" };
  const token = "fakeToken";
  const decodedUser = { id: "12345", email: "test@example.com" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash the password correctly", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      const result = await AuthService.hashPassword(password);
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe("comparePasswords", () => {
    it("should return true when passwords match", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await AuthService.comparePasswords(
        password,
        hashedPassword
      );
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it("should return false when passwords do not match", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await AuthService.comparePasswords(
        password,
        hashedPassword
      );
      expect(result).toBe(false);
    });
  });

  describe("generateToken", () => {
    it("should generate a JWT token", () => {
      (jwt.sign as jest.Mock).mockReturnValue(token);
      const result = AuthService.generateToken(payload);
      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.APP_AUTH_KEY, {
        expiresIn: process.env.APP_AUTH_TOKEN_EXPIRE,
      });
    });
  });

  describe("decodeToken", () => {
    it("should decode a JWT token", () => {
      (jwt.verify as jest.Mock).mockReturnValue(decodedUser);
      const result = AuthService.decodeToken(token);
      expect(result).toEqual(decodedUser);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.APP_AUTH_KEY);
    });
  });
});
