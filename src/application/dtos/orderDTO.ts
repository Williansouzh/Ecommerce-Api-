export class CreateOrderDTO {
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string; // New field for payment method
  paymentDetails: {
    // New field for payment details
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
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
    paymentMethod: string,
    paymentDetails: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
    },
    status?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.userId = userId;
    this.items = items;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.paymentDetails = paymentDetails;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
