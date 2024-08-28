export class CreateOrderDTO {
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    userId: string,
    items: {
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }[],
    totalPrice: number,
    status?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.userId = userId;
    this.items = items;
    this.totalPrice = totalPrice;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
