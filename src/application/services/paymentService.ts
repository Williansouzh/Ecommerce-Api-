import "reflect-metadata";
import { PaymentServiceInterface } from "@src/domain/services/paymentServiceInterface";
import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import dotenv from "dotenv";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { ApiError } from "@src/utils/api-errors";
import { SalesRepository } from "@src/adapters/database/repositories/salesRepository";
import { SaleEntity } from "@src/adapters/database/entities/salesEntity";

dotenv.config();

@injectable()
export class PaymentService implements PaymentServiceInterface {
  private stripe: Stripe;

  constructor(
    @inject("SalesRepository") private salesRepository: SalesRepository,
    @inject("OrderRepository")
    private orderRepository: OrderRepository
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "Stripe secret key is not defined in environment variables."
      );
    }

    this.stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  }

  async processPayment(
    orderId: string,
    paymentMethod: string,
    paymentDetails: { token: string }
  ): Promise<{
    message: string;
    transactionId: string;
    clientSecret?: string;
  }> {
    try {
      console.info(
        `Processing payment for order: ${orderId}, using method: ${paymentMethod}`
      );

      const order = await this.orderRepository.getOrder(orderId);
      if (!order) {
        throw new ApiError(
          "Order not found.",
          404,
          "Order lookup failed in payment service",
          "PaymentService"
        );
      }

      if (order.transactionId) {
        console.warn(
          `Order ${orderId} has already been paid with transaction ID: ${order.transactionId}`
        );
        return {
          message: "Order has already been paid",
          transactionId: order.transactionId,
        };
      }

      const amountInCents = Math.round(order.totalPrice * 100);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        payment_method: paymentDetails.token,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      await this.orderRepository.updateOrder(orderId, {
        transactionId: paymentIntent.id,
        status: "Paid",
      });

      console.info(
        `Payment processed successfully for order: ${orderId} with transaction ID: ${paymentIntent.id}.`
      );

      const saleData: Partial<SaleEntity> = {
        amount: order.totalPrice,
        userId: order.userId,
        orderId: orderId,
        transactionId: paymentIntent.id,
        saleDate: new Date(),
        order: order,
      };

      await this.salesRepository.createSale(saleData);
      return {
        message: "Payment processed successfully",
        transactionId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret as string,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        console.error(`Stripe error occurred: ${error.message}`);
        throw new ApiError(
          `Payment processing failed: ${error.message}`,
          500,
          "Payment Process Service",
          "Payment Process Service"
        );
      }

      console.error(
        "Unexpected error occurred during payment processing",
        error
      );
      throw new ApiError(
        "Payment processing failed due to an unexpected error.",
        500,
        "Payment Process Service",
        "Payment Process Service"
      );
    }
  }
}
