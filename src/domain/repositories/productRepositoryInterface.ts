import { ProductEntity } from "@src/adapters/database/entities/productEntity";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
export interface ProductRepositoryInterface {
  createProduct(product: ProductEntity): Promise<ProductEntity>;
  getProduct(id: string): Promise<ProductEntity | null>;
  updateProduct(
    id: string,
    product: Partial<ProductEntity>
  ): Promise<ProductEntity | null>;
  deleteProduct(id: string): Promise<boolean>;
}
