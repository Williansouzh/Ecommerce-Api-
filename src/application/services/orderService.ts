import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { OrderServiceInterface } from "@src/domain/services/orderServiceInterface";
import { CreateOrderDTO } from "../dtos/orderDTO";
import { CartService } from "./cartService";

@injectable()
export class OrderService implements OrderServiceInterface {
  constructor(
    @inject("OrderRepository") private orderRepository: OrderRepository,
    @inject("CartService") private cartService: CartService
  ) {}

  async createOrder(orderDTO: CreateOrderDTO): Promise<OrderEntity> {
    const cart = await this.cartService.getCart(orderDTO.userId);

    if (cart.items.length === 0) {
      throw new Error("Cart is empty. Cannot create an order.");
    }

    const order = new OrderEntity();
    order.userId = orderDTO.userId;
    order.totalPrice = cart.totalPrice;
    order.status = "pending";
    order.items = cart.items.map((item) => ({
      ...item,
      order,
    }));

    return await this.orderRepository.createOrder(order);
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
}
