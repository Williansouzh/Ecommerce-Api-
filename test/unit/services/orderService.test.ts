import "reflect-metadata";
import { OrderService } from "@src/application/services/orderService";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { CartService } from "@src/application/services/cartService";
import { mock, MockProxy } from "jest-mock-extended";
import { container } from "tsyringe";
import { OrderItemEntity } from "@src/adapters/database/entities/OrderItemEntity";
import { CartRepository } from "@src/adapters/database/repositories/cartRepository";
import ProductService from "@src/application/services/productService";
import { ProductRepository } from "@src/adapters/database/repositories/productRepository";

describe("OrderService", () => {
  let orderService: OrderService;
  let cartService: MockProxy<CartService>;
  let orderRepository: MockProxy<OrderRepository>;
  let cartRepository: MockProxy<CartRepository>;
  let productService: MockProxy<ProductService>;
  let productRepository: MockProxy<ProductRepository>;

  beforeEach(() => {
    productRepository = mock<ProductRepository>();
    cartRepository = mock<CartRepository>();
    orderRepository = mock<OrderRepository>();
    productService = mock<ProductService>();
    cartService = mock<CartService>();

    container.registerInstance("ProductRepository", productRepository);
    container.registerInstance("CartRepository", cartRepository);
    container.registerInstance("OrderRepository", orderRepository);
    container.registerInstance("ProductService", productService);
    container.registerInstance("CartService", cartService);

    orderService = container.resolve(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order", async () => {
    const orderDTO: CreateOrderDTO = {
      userId: "userId-123",
      totalPrice: 100,
      items: [],
      paymentMethod: "",
      paymentDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
    };

    const cartItems = [
      { productId: "product-123", name: "Product 1", quantity: 1, price: 100 },
    ];
    const cartEntity = {
      id: "cartId-123",
      userId: "userId-123",
      totalPrice: 100,
      items: [
        {
          productId: "product-123",
          name: "Product 1",
          quantity: 1,
          price: 100,
        },
      ],
    };

    const orderEntity = new OrderEntity();
    orderEntity.userId = orderDTO.userId;
    orderEntity.totalPrice = orderDTO.totalPrice;
    orderEntity.status = "pending";

    orderEntity.items = cartItems.map((item) => {
      const orderItem = new OrderItemEntity();
      orderItem.productId = item.productId;
      orderItem.name = item.name;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      orderItem.order = orderEntity;
      return orderItem;
    });

    cartService.getCart.mockResolvedValue(cartEntity);
    orderRepository.createOrder.mockResolvedValue(orderEntity);

    const result = await orderService.createOrder(orderDTO);

    expect(cartService.getCart).toHaveBeenCalledWith(orderDTO.userId);
    expect(orderRepository.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: orderDTO.userId,
        totalPrice: orderDTO.totalPrice,
        status: "pending",
        items: expect.arrayContaining([
          expect.objectContaining({
            productId: "product-123",
            name: "Product 1",
            quantity: 1,
            price: 100,
            order: orderEntity,
          }),
        ]),
      })
    );
    expect(result).toEqual(orderEntity);
  });

  it("should get an order by id", async () => {
    const orderId = "orderId-123";
    const orderEntity = new OrderEntity();
    orderEntity.id = orderId;

    orderRepository.getOrder.mockResolvedValue(orderEntity);

    const result = await orderService.getOrder(orderId);

    expect(orderRepository.getOrder).toHaveBeenCalledWith(orderId);
    expect(result).toEqual(orderEntity);
  });

  it("should get orders by user id", async () => {
    const userId = "userId-123";
    const orderEntity = new OrderEntity();
    orderEntity.userId = userId;

    orderRepository.getOrdersByUser.mockResolvedValue([orderEntity]);

    const result = await orderService.getOrdersByUser(userId);

    expect(orderRepository.getOrdersByUser).toHaveBeenCalledWith(userId);
    expect(result).toEqual([orderEntity]);
  });

  it("should get orders with pagination", async () => {
    const page = 1;
    const limit = 10;
    const orderEntity = new OrderEntity();

    orderRepository.getOrders.mockResolvedValue([orderEntity]);

    const result = await orderService.getOrders(page, limit);

    expect(orderRepository.getOrders).toHaveBeenCalledWith(page, limit);
    expect(result).toEqual([orderEntity]);
  });

  it("should update an order", async () => {
    const orderId = "orderId-123";
    const updateData = { status: "completed" };
    const updatedOrder = new OrderEntity();
    updatedOrder.id = orderId;
    updatedOrder.status = "completed";

    orderRepository.updateOrder.mockResolvedValue(updatedOrder);

    const result = await orderService.updateOrder(orderId, updateData);

    expect(orderRepository.updateOrder).toHaveBeenCalledWith(
      orderId,
      updateData
    );
    expect(result).toEqual(updatedOrder);
  });

  it("should delete an order", async () => {
    const orderId = "orderId-123";

    orderRepository.deleteOrder.mockResolvedValue(true);

    const result = await orderService.deleteOrder(orderId);

    expect(orderRepository.deleteOrder).toHaveBeenCalledWith(orderId);
    expect(result).toBe(true);
  });
});
