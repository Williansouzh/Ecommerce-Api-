import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";

export interface PaymentServiceInterface {
  processPayment(
    orderId: string,
    paymentMethod: string,
    paymentDetails: any
  ): Promise<{ message: string; transactionId: string }>;
}
