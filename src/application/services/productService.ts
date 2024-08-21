import { ProductEntity } from "@src/adapters/database/entities/productEntity";
import { ProductRepositoryInterface } from "@src/domain/repositories/productRepositoryInterface";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { inject, injectable } from "tsyringe";
import { CreateProductDTO } from "../dtos/productDTO";

@injectable()
export default class ProductService implements ProductServiceInterface {
  constructor(
    @inject("ProductRepository")
    private productRepository: ProductRepositoryInterface
  ) {}

  async createProduct(productDTO: CreateProductDTO): Promise<ProductEntity> {
    try {
      const product = new ProductEntity();
      Object.assign(product, productDTO);
      return await this.productRepository.createProduct(product);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error creating product: " + errorMessage);
    }
  }

  async getProduct(id: string): Promise<ProductEntity | null> {
    try {
      return await this.productRepository.getProduct(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error fetching product: " + errorMessage);
    }
  }

  async updateProduct(
    id: string,
    productDTO: Partial<CreateProductDTO>
  ): Promise<ProductEntity | null> {
    try {
      return await this.productRepository.updateProduct(id, productDTO);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error updating product: " + errorMessage);
    }
  }

  async deleteProduct(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.getProduct(id);
      if (!product) {
        throw new Error("Product not found");
      }
      await this.productRepository.deleteProduct(id);
      return product;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error deleting product: " + errorMessage);
    }
  }
}
