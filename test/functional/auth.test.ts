import "reflect-metadata";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { container } from "tsyringe";
import { App } from "@src/server";
import supertest from "supertest";

describe("AuthController", () => {
  let userRepository: UserRepository;
  const url = "/api-ecommerce/auth";
  let server: App;

  beforeAll(async () => {
    server = new App();
    await server.init();
    global.testRequest = supertest(server.getApp());

    userRepository = container.resolve(UserRepository);
    await userRepository.clear();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await userRepository.clear();
    await server.close();
  });

  describe("Basic Test Setup", () => {
    it("Should verify if global testRequest exists", async () => {
      expect(global.testRequest).toBeDefined();
    });
  });

  describe("Register New User", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        email: "test1@example.com",
        name: "Test User",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      const response = await global.testRequest
        .post(`${url}/register`)
        .send(newUser);

      //expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully",
        userId: expect.any(String),
      });

      const userInDb = await userRepository.getUserByEmail(newUser.email);
      expect(userInDb).not.toBeNull();
    });

    it("should return 400 if validation errors occur", async () => {
      const invalidUser = {
        email: "invalid-email",
        password: "short",
        confirmPassword: "not-matching",
      };

      const response = await global.testRequest
        .post(`${url}/register`)
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            location: "body",
            msg: expect.any(String),
            path: expect.any(String),
            type: "field",
          }),
        ])
      );
    });

    it("should return 400 if email is already registered", async () => {
      const newUser = {
        email: "test1@example.com",
        name: "Test User",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      await global.testRequest.post(`${url}/register`).send(newUser);

      const response = await global.testRequest
        .post(`${url}/register`)
        .send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "field",
            value: "test1@example.com",
            msg: "Email already registered",
            path: "email",
            location: "body",
          }),
        ])
      );
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      const newUser = {
        email: "test1@example.com",
        name: "Test User",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      await global.testRequest.post(`${url}/register`).send(newUser);
    });

    it("should log in a user successfully", async () => {
      const loginUser = {
        email: "test1@example.com",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      const response = await global.testRequest
        .post(`${url}/login`)
        .send(loginUser);

      //expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: loginUser.email,
          token: expect.any(String),
        })
      );
    });

    it("should return 400 if validation errors occur during login", async () => {
      const response = await global.testRequest.post(`${url}/login`).send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(expect.any(Array));
    });

    it("should return 401 if email or password is incorrect", async () => {
      const loginUser = {
        email: "test1@example.com",
        password: "incorrect_passwordFB1m**",
        confirmPassword: "incorrect_passwordFB1m**",
      };

      const response = await global.testRequest
        .post(`${url}/login`)
        .send(loginUser);

      expect(response.status).toBe(401);
      expect(response.body).toEqual(
        expect.objectContaining({
          errorType: "Unauthorized",
          errors: expect.arrayContaining([
            expect.objectContaining({
              message: "Invalid credentials",
              resource: "Unauthorized",
            }),
          ]),
        })
      );
    });
  });

  describe("AuthController - Password Recovery", () => {
    beforeEach(async () => {
      const newUser = {
        email: "test1@example.com",
        name: "Test User",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      await global.testRequest.post(`${url}/register`).send(newUser);
    });

    it("should send password recovery email", async () => {
      const response = await global.testRequest
        .post(`${url}/password-recovery`)
        .send({ email: "test1@example.com" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Password recovery email sent.",
      });
    });

    it("should return 400 if validation errors occur during password recovery", async () => {
      const response = await global.testRequest
        .post(`${url}/password-recovery`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(expect.any(Array));
    });
  });

  describe("AuthController - Password Reset", () => {
    let resetPasswordToken: string = "";

    beforeEach(async () => {
      const newUser = {
        email: "test1@example.com",
        name: "Test User",
        password: "FB1mF@ln*",
        confirmPassword: "FB1mF@ln*",
      };

      await global.testRequest.post(`${url}/register`).send(newUser);

      await global.testRequest
        .post(`${url}/password-recovery`)
        .send({ email: "test1@example.com" });

      const user = await userRepository.getUserByEmail("test1@example.com");
      if (user?.resetPasswordToken) {
        resetPasswordToken = user.resetPasswordToken;
      }
    });

    it("should reset the password successfully", async () => {
      const resetData = {
        newPassword: "FB1mF@ln**",
      };

      const response = await global.testRequest
        .post(`${url}/reset-password/${resetPasswordToken}`)
        .send(resetData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Password successfully updated.",
      });

      const updatedUser = await userRepository.getUserByEmail(
        "test1@example.com"
      );
      const isPasswordReset = await updatedUser?.validatePassword(
        resetData.newPassword
      );
      expect(isPasswordReset).toBe(true);
    });

    it("should return 400 if validation errors occur during password reset", async () => {
      const response = await global.testRequest
        .post(`${url}/reset-password/${resetPasswordToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(expect.any(Array));
    });
  });
});
