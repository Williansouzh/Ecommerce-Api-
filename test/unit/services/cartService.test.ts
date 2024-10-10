import "reflect-metadata";
import { CartService } from "@src/application/services/cartService"; // ajuste o caminho conforme necessário
import { CartRepository } from "@src/adapters/database/repositories/cartRepository";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { ApiError } from "@src/utils/api-errors";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { CartItemDTO } from "@src/application/dtos/cartDTO";

describe("CartService", () => {
  let cartService: CartService;
  let mockCartRepository: jest.Mocked<CartRepository>;
  let mockProductService: jest.Mocked<ProductServiceInterface>;

  beforeEach(() => {
    mockCartRepository = {
      addItem: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      getCart: jest.fn(),
    } as any;

    mockProductService = {
      getProduct: jest.fn(),
    } as any;

    cartService = new CartService(mockCartRepository, mockProductService);
  });

  describe("addItem", () => {
    it("should add an item to the cart", async () => {
      const userId = "user1";
      const productId = "product1";

      mockProductService.getProduct.mockResolvedValue({
        id: productId,
        name: "Test Product",
        description: "A product description",
        price: 100,
        category: {
          id: "category1",
          name: "Electronics",
          products: [],
        },
        createdAt: new Date("2024-08-26T00:00:00Z"),
        updatedAt: new Date("2024-08-26T00:00:00Z"),
      });

      const product: CartItemDTO = {
        productId: productId,
        name: "Test Product",
        quantity: 1,
        price: 100,
      };

      await cartService.addItem(userId, product);

      expect(mockCartRepository.addItem).toHaveBeenCalledWith(userId, product);
    });
  });

  describe("updateItem", () => {
    it("should update an item in the cart", async () => {
      const productId = "product1";
      const userId = "user1";
      const quantity = 3;

      mockProductService.getProduct.mockResolvedValue({
        id: productId,
        name: "Test Product",
        description: "A product description",
        price: 100,
        category: {
          id: "category1",
          name: "Electronics",
          products: [],
        },
        createdAt: new Date("2024-08-26T00:00:00Z"),
        updatedAt: new Date("2024-08-26T00:00:00Z"),
      });

      await cartService.updateItem(productId, quantity, userId);

      expect(mockCartRepository.updateItem).toHaveBeenCalledWith(
        userId,
        productId,
        quantity
      );
    });

    it("should throw an error if the product is not found", async () => {
      const productId = "product1";
      const userId = "user1";
      const quantity = 3;

      mockProductService.getProduct.mockResolvedValue(null);

      await expect(
        cartService.updateItem(productId, quantity, userId)
      ).rejects.toThrow(
        new ApiError(
          "Product not found",
          404,
          "productError",
          "Product Service"
        )
      );
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", async () => {
      const productId = "product1";
      const userId = "user1";

      await cartService.removeItem(productId, userId);

      expect(mockCartRepository.removeItem).toHaveBeenCalledWith(
        userId,
        productId
      );
    });
  });

  describe("getCart", () => {
    it("should return the user's cart", async () => {
      const userId = "user1";
      const mockCart = {
        id: "cart1",
        userId: "user1",
        totalPrice: 200,
        items: [],
      };

      mockCartRepository.getCart.mockResolvedValue(mockCart);

      const cart = await cartService.getCart(userId);

      expect(cart).toEqual(mockCart);
      expect(mockCartRepository.getCart).toHaveBeenCalledWith(userId);
    });

    it("should throw an error if the cart is not found", async () => {
      const userId = "user1";

      mockCartRepository.getCart.mockResolvedValue(null);

      await expect(cartService.getCart(userId)).rejects.toThrow(
        new ApiError("Cart not found", 404, "cartError", "Cart Service")
      );
    });
  });
});
