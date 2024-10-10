import "reflect-metadata"; // Import this to enable dependency injection
import { PaymentService } from "@src/application/services/paymentService"; // Adjust the import based on your structure
import { SalesRepository } from "@src/adapters/database/repositories/salesRepository";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { ApiError } from "@src/utils/api-errors";
import Stripe from "stripe";

jest.mock("@src/adapters/database/repositories/orderRepository");
jest.mock("@src/adapters/database/repositories/salesRepository");
jest.mock("stripe");

const mockOrderRepository = {
  getOrder: jest.fn(),
  updateOrder: jest.fn(),
};

const mockSalesRepository = {
  createSale: jest.fn(),
};

const mockStripe = {
  paymentIntents: {
    create: jest.fn(),
  },
};

(Stripe as unknown as jest.Mock).mockImplementation(() => mockStripe);

describe("PaymentService", () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(
      mockSalesRepository as unknown as SalesRepository,
      mockOrderRepository as unknown as OrderRepository
    );

    jest.clearAllMocks();
  });

  it("should process payment successfully", async () => {
    const orderId = "1";
    const paymentMethod = "card";
    const paymentDetails = { token: "some-token" };

    mockOrderRepository.getOrder.mockResolvedValue({
      id: orderId,
      totalPrice: 100,
      userId: "user-id",
      transactionId: null,
    });

    mockStripe.paymentIntents.create.mockResolvedValue({
      id: "transaction_id",
      client_secret: "client_secret",
    });

    const result = await paymentService.processPayment(
      orderId,
      paymentMethod,
      paymentDetails
    );

    expect(result.message).toBe("Payment processed successfully");
    expect(result.transactionId).toBe("transaction_id");
    expect(mockOrderRepository.updateOrder).toHaveBeenCalledWith(orderId, {
      transactionId: "transaction_id",
      status: "Paid",
    });
    expect(mockSalesRepository.createSale).toHaveBeenCalled();
  });

  it("should throw an error if order is not found", async () => {
    const orderId = "1";
    const paymentMethod = "card";
    const paymentDetails = { token: "some-token" };

    mockOrderRepository.getOrder.mockResolvedValue(null);

    await expect(
      paymentService.processPayment(orderId, paymentMethod, paymentDetails)
    ).rejects.toThrow(
      new ApiError(
        "Payment processing failed due to an unexpected error.",
        404,
        "Order lookup failed in payment service",
        "PaymentService"
      )
    );
  });

  it("should throw an error if the order has already been paid", async () => {
    const orderId = "1";
    const paymentMethod = "card";
    const paymentDetails = { token: "some-token" };

    mockOrderRepository.getOrder.mockResolvedValue({
      id: orderId,
      totalPrice: 100,
      userId: "user-id",
      transactionId: "existing_transaction_id",
    });

    const result = await paymentService.processPayment(
      orderId,
      paymentMethod,
      paymentDetails
    );

    expect(result.message).toBe("Order has already been paid");
    expect(result.transactionId).toBe("existing_transaction_id");
    expect(mockOrderRepository.updateOrder).not.toHaveBeenCalled();
    expect(mockSalesRepository.createSale).not.toHaveBeenCalled();
  });

  it("should throw a Stripe error", async () => {
    const orderId = "1";
    const paymentMethod = "card";
    const paymentDetails = { token: "some-token" };

    mockOrderRepository.getOrder.mockResolvedValue({
      id: orderId,
      totalPrice: 100,
      userId: "user-id",
      transactionId: null,
    });

    mockStripe.paymentIntents.create.mockRejectedValue({
      type: "StripeError",
      message: "Stripe error occurred",
      code: "test_code",
      param: "test_param",
      statusCode: 400,
    } as Stripe.errors.StripeError);

    await expect(
      paymentService.processPayment(orderId, paymentMethod, paymentDetails)
    ).rejects.toThrow(
      new Error("Payment processing failed due to an unexpected error.")
    );
  });

  it("should throw an unexpected error", async () => {
    const orderId = "1";
    const paymentMethod = "card";
    const paymentDetails = { token: "some-token" };

    mockOrderRepository.getOrder.mockResolvedValue({
      id: orderId,
      totalPrice: 100,
      userId: "user-id",
      transactionId: null,
    });

    mockStripe.paymentIntents.create.mockRejectedValue(
      new Error("Unexpected error")
    );

    await expect(
      paymentService.processPayment(orderId, paymentMethod, paymentDetails)
    ).rejects.toThrow(
      new ApiError(
        "Payment processing failed due to an unexpected error.",
        500,
        "Payment Process Service",
        "Payment Process Service"
      )
    );
  });
});
