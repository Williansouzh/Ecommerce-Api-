import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { CartServiceInterface } from "@src/domain/services/cartServiceInterface";
import { CartRepository } from "@src/adapters/database/repositories/cartRepository";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { ApiError } from "@src/utils/api-errors";
import { CartDTO, CartItemDTO } from "@src/application/dtos/cartDTO";

@injectable()
export class CartService implements CartServiceInterface {
  constructor(
    @inject("CartRepository") private cartRepository: CartRepository,
    @inject("ProductService") private productService: ProductServiceInterface
  ) {}

  public async addItem(userId: string, newItem: CartItemDTO): Promise<void> {
    const product = await this.productService.getProduct(newItem.productId);

    if (!product) {
      throw new ApiError(
        "Product not found",
        404,
        "productError",
        "Product Service"
      );
    }

    const item: CartItemDTO = {
      productId: newItem.productId,
      quantity: newItem.quantity,
      name: product.name,
      price: product.price,
    };

    await this.cartRepository.addItem(userId, item);
  }

  public async updateItem(
    productId: string,
    quantity: number,
    userId: string
  ): Promise<void> {
    const product = await this.productService.getProduct(productId);
    if (!product) {
      throw new ApiError(
        "Product not found",
        404,
        "productError",
        "Product Service"
      );
    }

    await this.cartRepository.updateItem(userId, productId, quantity);
  }

  public async removeItem(productId: string, userId: string): Promise<void> {
    await this.cartRepository.removeItem(userId, productId);
  }
  public async removeAll(userId: string): Promise<void> {
    await this.cartRepository.removeAll(userId);
  }
  public async getCart(userId: string): Promise<CartDTO> {
    const cart = await this.cartRepository.getCart(userId);
    if (!cart) {
      throw new ApiError("Cart not found", 404, "cartError", "Cart Service");
    }
    return cart;
  }
}
