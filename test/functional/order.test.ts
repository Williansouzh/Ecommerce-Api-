import "reflect-metadata";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { App } from "@src/server";
import supertest from "supertest";
import { container } from "tsyringe";

describe("Order Controller", () => {
  let server: App;
  let tokenLogin: string;
  let productId: string;
  let userRepository: UserRepository;

  const orderRepository: OrderRepository = container.resolve(OrderRepository);
  const baseUrl = "/api-ecommerce/order";

  const testUser = {
    email: "test1@example.com",
    name: "Test User",
    password: "FB1mF@ln*",
    confirmPassword: "FB1mF@ln*",
  };

  const loginUser = {
    email: testUser.email,
    password: testUser.password,
    confirmPassword: testUser.confirmPassword,
  };

  const testProduct = {
    name: "John Doe",
    description: "Sample product description",
    price: 3455,
    categoryId: "550e8400-e29b-41d4-a716-446655440000",
  };

  const testCart = {
    productId: "007da8d4-47de-4b23-a75c-412810950262",
    quantity: 12,
  };

  beforeAll(async () => {
    server = new App();
    await server.init();
    global.testRequest = supertest(server.getApp());
    userRepository = container.resolve(UserRepository);

    await userRepository.clear();

    await setupTestData();
  });

  afterAll(async () => {
    await userRepository.clear();
    await server.close();
  });

  describe("CRUD Operations for Orders", () => {
    it("should create a new order", async () => {
      const orderData: CreateOrderDTO = {
        userId: "",
        items: [
          {
            productId: "prod_001",
            name: "Product 1",
            quantity: 2,
            price: 15.99,
          },
          {
            productId: "prod_002",
            name: "Product 2",
            quantity: 1,
            price: 29.99,
          },
        ],
        totalPrice: 61.97,
      };

      const response = await global.testRequest
        .post(baseUrl)
        .set("x-access-token", tokenLogin)
        .send(orderData);

      //expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Order registered successfully",
        orderId: expect.any(String),
      });
    });
  });

  async function setupTestData() {
    await registerTestUser();
    tokenLogin = await loginAndGetToken();
    productId = await createProduct();
    await createCart();
  }

  async function registerTestUser() {
    const existingUser = await userRepository.getUserByEmail(testUser.email);
    if (!existingUser) {
      await userRepository.clear();
      const response = await global.testRequest
        .post("/api-ecommerce/auth/register")
        .send(testUser);

      expect(response.body).toEqual({
        message: "User registered successfully",
        userId: expect.any(String),
      });
    } else {
      tokenLogin = await loginAndGetToken();
    }
  }

  async function createProduct(): Promise<string> {
    const response = await global.testRequest
      .post("/api-ecommerce/products")
      .set("x-access-token", tokenLogin)
      .send(testProduct);

    expect(response.status).toBe(201);
    return response.body.productId;
  }

  async function createCart() {
    const response = await global.testRequest
      .post("/api-ecommerce/cart")
      .set("x-access-token", tokenLogin)
      .send(testCart);

    expect(response.status).toBe(200);
  }

  async function loginAndGetToken(): Promise<string> {
    const loginResponse = await global.testRequest
      .post("/api-ecommerce/auth/login")
      .send(loginUser);

    expect(loginResponse.body).toEqual(
      expect.objectContaining({
        email: loginUser.email,
        token: expect.any(String),
      })
    );

    return loginResponse.body.token;
  }
});
