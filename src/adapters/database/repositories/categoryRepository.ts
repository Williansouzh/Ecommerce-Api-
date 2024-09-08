import "reflect-metadata";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { AppDataSource } from "@src/data-source";
import { CategoryRepositoryInterface } from "@src/domain/repositories/categoryRepositoryInterface";
import { CategoryEntity } from "../entities/categoryEntity";

@injectable()
export class CategoryRepository implements CategoryRepositoryInterface {
  private repository: Repository<CategoryEntity>;
  constructor() {
    this.repository = AppDataSource.getRepository(CategoryEntity);
  }
  async createCategory(
    category: CategoryEntity
  ): Promise<Promise<CategoryEntity>> {
    return await this.repository.save(category);
  }
  async listCategories(page: number, limit: number): Promise<CategoryEntity[]> {
    return await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
