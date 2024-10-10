import "reflect-metadata";
import { OrderService } from "@src/application/services/orderService";
import { OrderRepository } from "@src/adapters/database/repositories/orderRepository";
import { CartService } from "@src/application/services/cartService";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { ApiError } from "@src/utils/api-errors";
import { OrderEntity } from "@src/adapters/database/entities/orderEntity";
import { CartDTO } from "@src/application/dtos/cartDTO";
import { OrderItemEntity } from "@src/adapters/database/entities/OrderItemEntity";

const mockOrderRepository = {
  createOrder: jest.fn(),
  getOrder: jest.fn(),
  getOrdersByUser: jest.fn(),
  getOrders: jest.fn(),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn(),
};

const mockCartService = {
  getCart: jest.fn(),
};

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService(
      mockOrderRepository as any,
      mockCartService as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should throw an error if the cart is empty", async () => {
      const orderDTO: CreateOrderDTO = {
        userId: "user123",
        items: [],
        totalPrice: 0,
        paymentMethod: "",
        paymentDetails: {
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        },
      };
      mockCartService.getCart.mockResolvedValueOnce({ items: [] });

      // Act & Assert
      await expect(orderService.createOrder(orderDTO)).rejects.toThrow(
        new ApiError(
          "Cart is empty. Cannot create an order.",
          400,
          "Cart Error",
          "Cart Service"
        )
      );
    });

    it("should create an order successfully when the cart has items", async () => {
      const orderDTO: CreateOrderDTO = {
        userId: "user123",
        items: [],
        totalPrice: 0,
        paymentMethod: "",
        paymentDetails: {
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        },
      };
      const cart: CartDTO = {
        userId: "user123",
        items: [
          {
            productId: "prod123",
            name: "Product 1",
            quantity: 2,
            price: 100,
          },
        ],
        totalPrice: 200,
        id: "",
      };

      mockCartService.getCart.mockResolvedValueOnce(cart);

      const savedOrder = new OrderEntity();
      savedOrder.orderId = "ORD-12345";
      savedOrder.userId = "user123";
      savedOrder.totalPrice = cart.totalPrice;
      savedOrder.items = cart.items.map((item) => {
        const orderItem = new OrderItemEntity();
        orderItem.productId = item.productId;
        orderItem.name = item.name;
        orderItem.quantity = item.quantity;
        orderItem.price = item.price;
        return orderItem;
      });

      mockOrderRepository.createOrder.mockResolvedValueOnce(savedOrder);

      const result = await orderService.createOrder(orderDTO);

      expect(result).toEqual(savedOrder);
      expect(mockCartService.getCart).toHaveBeenCalledWith(orderDTO.userId);
      expect(mockOrderRepository.createOrder).toHaveBeenCalled();
      expect(mockOrderRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user123",
          totalPrice: cart.totalPrice,
          status: "pending",
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: "prod123",
              quantity: 2,
              price: 100,
            }),
          ]),
        })
      );
    });
  });
});
