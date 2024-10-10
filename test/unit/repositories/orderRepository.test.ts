import "reflect-metadata";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { AppDataSource } from "@src/data-source";
import { Repository } from "typeorm";

jest.mock("@src/data-source");

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;
  let mockRepository: jest.Mocked<Repository<OrderEntity>>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    orderRepository = new OrderRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order", async () => {
    const order = new OrderEntity();
    mockRepository.save.mockResolvedValue(order);

    const result = await orderRepository.createOrder(order);
    expect(result).toEqual(order);
    expect(mockRepository.save).toHaveBeenCalledWith(order);
  });

  it("should get an order by id", async () => {
    const orderId = "1";
    const order = new OrderEntity();
    mockRepository.findOne.mockResolvedValue(order);

    const result = await orderRepository.getOrder(orderId);
    expect(result).toEqual(order);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: orderId },
    });
  });

  it("should return null if order not found", async () => {
    const orderId = "1";
    mockRepository.findOne.mockResolvedValue(null);

    const result = await orderRepository.getOrder(orderId);
    expect(result).toBeNull();
  });

  it("should update an order", async () => {
    const orderId = "1";
    const existingOrder = new OrderEntity();
    const updateData = { totalPrice: 200 };

    jest.spyOn(orderRepository, "getOrder").mockResolvedValue(existingOrder);

    mockRepository.save.mockResolvedValue({ ...existingOrder, ...updateData });

    const result = await orderRepository.updateOrder(orderId, updateData);
    expect(result).toEqual({ ...existingOrder, ...updateData });
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(updateData)
    );
  });

  it("should return null when updating a non-existent order", async () => {
    const orderId = "1";
    const updateData = { totalPrice: 200 };

    jest.spyOn(orderRepository, "getOrder").mockResolvedValue(null);

    const result = await orderRepository.updateOrder(orderId, updateData);
    expect(result).toBeNull();
  });

  it("should delete an order", async () => {
    const orderId = "1";
    mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

    const result = await orderRepository.deleteOrder(orderId);
    expect(result).toBe(true);
    expect(mockRepository.delete).toHaveBeenCalledWith(orderId);
  });

  it("should return false if order not found for deletion", async () => {
    const orderId = "1";
    mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

    const result = await orderRepository.deleteOrder(orderId);
    expect(result).toBe(false);
  });

  it("should get orders by user id", async () => {
    const userId = "user1";
    const orders = [new OrderEntity(), new OrderEntity()];
    mockRepository.find.mockResolvedValue(orders);

    const result = await orderRepository.getOrdersByUser(userId);
    expect(result).toEqual(orders);
    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { userId },
      relations: ["items"],
    });
  });

  it("should get orders with pagination", async () => {
    const page = 1;
    const limit = 10;
    const orders = [new OrderEntity(), new OrderEntity()];
    mockRepository.find.mockResolvedValue(orders);

    const result = await orderRepository.getOrders(page, limit);
    expect(result).toEqual(orders);
    expect(mockRepository.find).toHaveBeenCalledWith({
      skip: (page - 1) * limit,
      take: limit,
    });
  });
});
