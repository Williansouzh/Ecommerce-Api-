import { CartDTO } from "@src/application/dtos/cartDTO";

export interface CartServiceInterface {
  addItem(productId: string, quantity: number, userId: string): Promise<void>;
  updateItem(
    productId: string,
    quantity: number,
    userId: string
  ): Promise<void>;
  removeItem(productId: string, userId: string): Promise<void>;
  getCart(userId: string): Promise<CartDTO>;
}
