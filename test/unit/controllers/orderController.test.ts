import "reflect-metadata";
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { OrderController } from "@src/adapters/controllers/orderController";
import { OrderServiceInterface } from "@src/domain/services/orderServiceInterface";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { DecodedUser } from "@src/application/services/authService";

const mockOrderService = {
  createOrder: jest.fn(),
  getOrdersByUser: jest.fn(),
  getOrder: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn(),
};

const app = express();
app.use(express.json());

const orderController = new OrderController(
  mockOrderService as unknown as OrderServiceInterface
);

app.post("/orders", (req: Request, res: Response, next: NextFunction) =>
  orderController.createOrder(req, res, next)
);
app.get("/orders", (req: Request, res: Response, next: NextFunction) =>
  orderController.getOrders(req, res, next)
);
app.put(
  "/orders/:id/status",
  (req: Request, res: Response, next: NextFunction) =>
    orderController.updateOrderStatus(req, res, next)
);
app.delete("/orders/:id", (req: Request, res: Response, next: NextFunction) =>
  orderController.deleteOrder(req as Request<{ id: string }>, res, next)
);

describe("OrderController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const mockUserId = "123";
  const decoded: DecodedUser = {
    userId: mockUserId,
    name: "John Doe",
    email: "john.doe@example.com",
    password: "hashed_password",
    validatePassword: jest.fn(),
  };

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      decoded: decoded,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should create an order", async () => {
    const reqBody: CreateOrderDTO = {
      items: [],
      totalPrice: 100,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
      paymentMethod: "CREDIT_CARD",
      userId: mockUserId,
    };

    req.body = reqBody;

    mockOrderService.createOrder.mockResolvedValueOnce({ id: "order123" });

    await orderController.createOrder(req as Request, res as Response, next);

    expect(mockOrderService.createOrder).toHaveBeenCalledWith(reqBody);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order registered successfully",
      orderId: "order123",
    });
  });

  test("should return 400 if userId is missing during order creation", async () => {
    req.decoded = { ...decoded, userId: "" };

    await orderController.createOrder(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User ID is required." });
  });

  test("should get orders for a user", async () => {
    const mockOrders = [{ id: "order123" }, { id: "order456" }];

    mockOrderService.getOrdersByUser.mockResolvedValueOnce(mockOrders);

    await orderController.getOrders(req as Request, res as Response, next);

    expect(mockOrderService.getOrdersByUser).toHaveBeenCalledWith(mockUserId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  test("should return 400 if userId is missing when getting orders", async () => {
    req.decoded = { ...decoded, userId: "" };

    await orderController.getOrders(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User ID is required." });
  });

  test("should update order status", async () => {
    req.params = { id: "order123" };
    req.body = { status: "SHIPPED" };

    mockOrderService.getOrder.mockResolvedValueOnce({
      id: "order123",
      userId: mockUserId,
    });
    mockOrderService.updateOrder.mockResolvedValueOnce(undefined);

    await orderController.updateOrderStatus(
      req as Request,
      res as Response,
      next
    );

    expect(mockOrderService.updateOrder).toHaveBeenCalledWith(
      req.params.id,
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order status updated successfully",
    });
  });

  test("should return 404 if order not found during status update", async () => {
    req.params = { id: "order123" };
    req.body = { status: "SHIPPED" };

    mockOrderService.getOrder.mockResolvedValueOnce(null);

    await orderController.updateOrderStatus(
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order not found or access denied.",
    });
  });

  test("should delete an order", async () => {
    req.params = { id: "order123" };

    mockOrderService.getOrder.mockResolvedValueOnce({
      id: "order123",
      userId: mockUserId,
    });
    mockOrderService.deleteOrder.mockResolvedValueOnce(true);

    await orderController.deleteOrder(
      req as Request<{ id: string }>,
      res as Response,
      next
    );

    expect(mockOrderService.deleteOrder).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order deleted successfully",
    });
  });

  test("should return 404 if order not found during deletion", async () => {
    req.params = { id: "order123" };

    mockOrderService.getOrder.mockResolvedValueOnce(null);

    await orderController.deleteOrder(
      req as Request<{ id: string }>,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order not found or access denied.",
    });
  });
});
