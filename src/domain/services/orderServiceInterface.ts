import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";

export interface OrderServiceInterface {
  createOrder(order: CreateOrderDTO): Promise<OrderEntity>;
  getOrder(id: string): Promise<OrderEntity | null>;
  updateOrder(
    id: string,
    orderDTO: Partial<CreateOrderDTO>
  ): Promise<OrderEntity | null>;
  deleteOrder(id: string): Promise<boolean>;
  getOrdersByUser(userId: string): Promise<OrderEntity[]>;
  getOrders(page: number, limit: number): Promise<OrderEntity[]>;
}
