export class CreateProductDTO {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  constructor(
    name: string,
    description: string,
    price: number,
    categoryId: string
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.categoryId = categoryId;
  }
}
