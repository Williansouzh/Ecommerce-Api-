import { ProductRepositoryInterface } from "@src/domain/repositories/productRepositoryInterface";
import { injectable } from "tsyringe";
import { ProductEntity } from "../entities/productEntity";
import { Repository } from "typeorm";
import { AppDataSource } from "@src/data-source";

@injectable()
export class ProductRepository implements ProductRepositoryInterface {
  private repository: Repository<ProductEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductEntity);
  }
  async getProduct(id: string): Promise<ProductEntity | null> {
    try {
      return (await this.repository.findOne({ where: { id } })) || null;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error fetching product: " + errorMessage);
    }
  }

  async createProduct(product: ProductEntity): Promise<ProductEntity> {
    try {
      return await this.repository.save(product);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error creating product: " + errorMessage);
    }
  }

  async updateProduct(
    id: string,
    product: Partial<ProductEntity>
  ): Promise<ProductEntity | null> {
    try {
      await this.repository.update(id, product);
      return await this.getProduct(id);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error updating product: " + errorMessage);
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== 0;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error("Error deleting product: " + errorMessage);
    }
  }
}
