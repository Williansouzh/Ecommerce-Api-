export interface CartItemDTO {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  totalPrice: number;
}
