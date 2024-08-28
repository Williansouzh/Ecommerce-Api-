import { CartEntity } from "@src/adapters/database/entities/cartEntity";
import { CartDTO } from "@src/application/dtos/cartDTO";

export interface CartRepositoryInterface {
  addItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartEntity>;
  updateItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartEntity>;
  removeItem(userId: string, productId: string): Promise<void>;
  getCart(userId: string): Promise<CartDTO | null>;
}
