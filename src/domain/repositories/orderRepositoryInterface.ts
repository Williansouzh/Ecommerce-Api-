import { OrderEntity } from "@src/adapters/database/entities/orderEntity";

export interface OrderRepositoryInterface {
  createOrder(order: OrderEntity): Promise<OrderEntity>;
  getOrder(id: string): Promise<OrderEntity | null>;
  updateOrder(
    id: string,
    order: Partial<OrderEntity>
  ): Promise<OrderEntity | null>;
  deleteOrder(id: string): Promise<boolean>;

  getOrdersByUser(userId: string): Promise<OrderEntity[]>;
  getOrders(page: number, limit: number): Promise<OrderEntity[]>;
}
