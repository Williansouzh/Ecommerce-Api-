import { CartDTO, CartItemDTO } from "@src/application/dtos/cartDTO";

export interface CartServiceInterface {
  addItem(userid: string, newItem: CartItemDTO): Promise<void>;
  updateItem(
    productId: string,
    quantity: number,
    userId: string
  ): Promise<void>;
  removeItem(productId: string, userId: string): Promise<void>;
  getCart(userId: string): Promise<CartDTO>;
  removeAll(userId: string): Promise<void>;
}
