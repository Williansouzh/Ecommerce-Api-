import { PaymentController } from "@src/adapters/controllers/paymentController";
import { CartService } from "@src/application/services/cartService";
import { PaymentService } from "@src/application/services/paymentService";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "@src/utils/api-errors";

describe("PaymentController", () => {
  let paymentController: PaymentController;
  let mockCartService: jest.Mocked<CartService>;
  let mockPaymentService: jest.Mocked<PaymentService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockCartService = {
      removeAll: jest.fn(),
    } as unknown as jest.Mocked<CartService>;

    mockPaymentService = {
      processPayment: jest.fn(),
    } as unknown as jest.Mocked<PaymentService>;

    paymentController = new PaymentController(
      mockCartService,
      mockPaymentService
    );

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("should handle payment request successfully", async () => {
    const orderId = "12345";
    const paymentMethod = "credit_card";
    const paymentDetails = { cardNumber: "4111111111111111" };
    const userId = "user123";

    req = {
      body: { orderId, paymentMethod, paymentDetails },
      decoded: { userId },
    } as Partial<Request>;

    mockPaymentService.processPayment.mockResolvedValue({
      message: "Payment processed successfully",
      transactionId: "txn_12345",
      clientSecret: "secret_key",
    });

    await paymentController.handlePaymentRequest(
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Payment processed successfully",
      transactionId: "txn_12345",
      clientSecret: "secret_key",
    });
    expect(mockCartService.removeAll).toHaveBeenCalledWith(userId);
  });

  /*test("should return 400 if validation fails", async () => {
    req = {
      body: {},
      decoded: { userId: "user123" },
    } as Partial<Request>;

    await paymentController.handlePaymentRequest(
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });*/

  test("should throw an error if userId is missing", async () => {
    req = {
      body: {
        orderId: "12345",
        paymentMethod: "credit_card",
        paymentDetails: { cardNumber: "4111111111111111" },
      },
      decoded: {},
    } as Partial<Request>;

    await paymentController.handlePaymentRequest(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].message).toBe("User id not found");
  });

  test("should call next with an error if payment processing fails", async () => {
    const orderId = "12345";
    const paymentMethod = "credit_card";
    const paymentDetails = { cardNumber: "4111111111111111" };
    const userId = "user123";

    req = {
      body: { orderId, paymentMethod, paymentDetails },
      decoded: { userId },
    } as Partial<Request>;

    const errorMessage = "Payment processing failed";
    mockPaymentService.processPayment.mockRejectedValue(
      new Error(errorMessage)
    );

    await paymentController.handlePaymentRequest(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe(errorMessage);
  });
});
