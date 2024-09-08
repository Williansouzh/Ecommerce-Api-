import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { OrderServiceInterface } from "@src/domain/services/orderServiceInterface";
import { CreateOrderDTO } from "../dtos/orderDTO";
import { CartService } from "./cartService";
import { ApiError } from "@src/utils/api-errors";
import { CartDTO } from "../dtos/cartDTO";
import { OrderItemEntity } from "@src/adapters/database/entities/OrderItemEntity";

@injectable()
export class OrderService implements OrderServiceInterface {
  constructor(
    @inject("OrderRepository") private orderRepository: OrderRepository,
    @inject("CartService") private cartService: CartService
  ) {}
  public async createOrder(orderDTO: CreateOrderDTO): Promise<OrderEntity> {
    const cart = await this.cartService.getCart(orderDTO.userId);

    if (!cart || cart.items.length === 0) {
      throw new ApiError(
        "Cart is empty. Cannot create an order.",
        400,
        "Cart Error",
        "Cart Service"
      );
    }

    const order = this.buildOrderEntity(orderDTO.userId, cart);
    return await this.orderRepository.createOrder(order);
  }

  private buildOrderEntity(userId: string, cart: CartDTO): OrderEntity {
    const order = new OrderEntity();
    order.orderId = this.generateOrderId();
    order.userId = userId;
    order.totalPrice = cart.totalPrice;
    order.status = "pending";
    order.transactionId = "";
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.items = cart.items.map((item) => {
      const orderItem = new OrderItemEntity();
      orderItem.productId = item.productId;
      orderItem.name = item.name;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      orderItem.order = order;

      return orderItem;
    });
    console.log(order);
    return order;
  }

  async getOrder(id: string): Promise<OrderEntity | null> {
    return await this.orderRepository.getOrder(id);
  }

  async getOrdersByUser(userId: string): Promise<OrderEntity[]> {
    return await this.orderRepository.getOrdersByUser(userId);
  }

  async getOrders(page: number, limit: number): Promise<OrderEntity[]> {
    return await this.orderRepository.getOrders(page, limit);
  }

  async updateOrder(
    id: string,
    orderDTO: Partial<OrderEntity>
  ): Promise<OrderEntity | null> {
    return await this.orderRepository.updateOrder(id, orderDTO);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return await this.orderRepository.deleteOrder(id);
  }
  private generateOrderId(): string {
    const timestamp = Date.now();
    return `ORD-${timestamp}`;
  }
}
