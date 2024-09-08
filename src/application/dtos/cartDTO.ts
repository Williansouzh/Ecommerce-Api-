export class CartItemDTO {
  productId: string;
  name: string;
  quantity: number;
  price: number;

  constructor(
    productId: string,
    name: string,
    quantity: number,
    price: number
  ) {
    this.productId = productId;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
  }
}

export class CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  totalPrice: number;

  constructor(
    id: string,
    userId: string,
    items: CartItemDTO[],
    totalPrice: number
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalPrice = totalPrice;
  }
}
