import { CartEntity } from "@src/adapters/database/entities/cartEntity";
import { CartDTO, CartItemDTO } from "@src/application/dtos/cartDTO";

export interface CartRepositoryInterface {
  addItem(userid: string, newItem: CartItemDTO): Promise<CartEntity>;
  updateItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartEntity>;
  removeItem(userId: string, productId: string): Promise<void>;
  getCart(userId: string): Promise<CartDTO | null>;
  removeAll(userId: string): Promise<void>;
}
