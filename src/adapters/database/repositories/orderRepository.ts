import "reflect-metadata";
import { OrderRepositoryInterface } from "@src/domain/repositories/orderRepositoryInterface";
import { injectable } from "tsyringe";
import { OrderEntity } from "../entities/orderEntity";
import { Repository } from "typeorm";
import { AppDataSource } from "@src/data-source";

@injectable()
export class OrderRepository implements OrderRepositoryInterface {
  private repository: Repository<OrderEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderEntity);
  }

  async createOrder(order: OrderEntity): Promise<OrderEntity> {
    return await this.repository.save(order);
  }

  async getOrder(id: string): Promise<OrderEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async updateOrder(
    id: string,
    product: Partial<OrderEntity>
  ): Promise<OrderEntity | null> {
    const order = await this.getOrder(id);
    if (!order) return null;

    Object.assign(order, product);
    return await this.repository.save(order);
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getOrdersByUser(userId: string): Promise<OrderEntity[]> {
    return await this.repository.find({
      where: { userId },
      relations: ["items"],
    });
  }

  async getOrders(page: number, limit: number): Promise<OrderEntity[]> {
    return await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
