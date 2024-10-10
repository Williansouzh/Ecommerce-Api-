import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import express, { Request, Response, NextFunction } from "express";
import { CartController } from "@src/adapters/controllers/cartController"; // Adjust the import path
import { CartServiceInterface } from "@src/domain/services/cartServiceInterface"; // Adjust the import path

const mockCartService = {
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  getCart: jest.fn(),
};

const app = express();
app.use(express.json());

const cartController = new CartController(
  mockCartService as unknown as CartServiceInterface
);

app.post("/cart/items", (req: Request, res: Response, next: NextFunction) =>
  cartController.addItem(req, res, next)
);
app.put("/cart/items", (req: Request, res: Response, next: NextFunction) =>
  cartController.updateItem(req, res, next)
);
app.delete(
  "/cart/items/:productId",
  (req: Request, res: Response, next: NextFunction) =>
    cartController.removeItem(req, res, next)
);
app.get("/cart", (req: Request, res: Response, next: NextFunction) =>
  cartController.getCart(req, res, next)
);

describe("CartController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add an item to the cart", async () => {
    const mockUserId = "123";
    const reqBody = {
      name: "Test Product",
      productId: "1",
      price: 100,
      quantity: 2,
    };

    const req = {
      body: reqBody,
      decoded: { userId: mockUserId },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    mockCartService.addItem.mockResolvedValueOnce(undefined);

    await cartController.addItem(req, res, next);

    expect(mockCartService.addItem).toHaveBeenCalledWith(
      mockUserId,
      expect.objectContaining(reqBody)
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Item added to cart" });
  });

  test("should return 500 if userId is missing", async () => {
    const reqBody = {
      name: "Test Product",
      productId: "1",
      price: 100,
      quantity: 2,
    };

    const req = {
      body: reqBody,
      decoded: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    await cartController.addItem(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("User id is required"));
  });

  test("should update an item in the cart", async () => {
    const mockUserId = "123";
    const reqBody = { productId: "1", quantity: 2 };

    const req = {
      body: reqBody,
      decoded: { userId: mockUserId },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    mockCartService.updateItem.mockResolvedValueOnce(undefined);

    await cartController.updateItem(req, res, next);

    expect(mockCartService.updateItem).toHaveBeenCalledWith(
      reqBody.productId,
      reqBody.quantity,
      mockUserId
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cart updated successfully",
    });
  });

  test("should remove an item from the cart", async () => {
    const mockUserId = "123";
    const reqParams = { productId: "1" };

    const req = {
      params: reqParams,
      decoded: { userId: mockUserId },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    mockCartService.removeItem.mockResolvedValueOnce(undefined);

    await cartController.removeItem(req, res, next);

    expect(mockCartService.removeItem).toHaveBeenCalledWith(
      reqParams.productId,
      mockUserId
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Item removed from cart",
    });
  });

  test("should get the cart", async () => {
    const mockUserId = "123";
    const cartData = { items: [] };

    const req = {
      decoded: { userId: mockUserId },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn();

    mockCartService.getCart.mockResolvedValueOnce(cartData);

    await cartController.getCart(req, res, next);

    expect(mockCartService.getCart).toHaveBeenCalledWith(mockUserId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cartData);
  });
});
