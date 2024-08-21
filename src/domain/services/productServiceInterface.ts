import { ProductEntity } from "@src/adapters/database/entities/productEntity";
import { CreateProductDTO } from "@src/application/dtos/productDTO";

export interface ProductServiceInterface {
  createProduct(product: CreateProductDTO): Promise<ProductEntity>;
  getProduct(id: string): Promise<ProductEntity | null>;
  updateProduct(
    id: string,
    productDTO: Partial<CreateProductDTO>
  ): Promise<ProductEntity | null>;
  deleteProduct(id: string): Promise<ProductEntity>;
}
