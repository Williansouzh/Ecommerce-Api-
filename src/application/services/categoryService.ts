import "reflect-metadata";
import { injectable } from "tsyringe";
import { CategoryRepository } from "@src/adapters/database/repositories/categoryRepository";
import { CategoryEntity } from "@src/adapters/database/entities/categoryEntity";
import { CategoryServiceInterface } from "@src/domain/services/categoryServiceInterface";

@injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(name: string): Promise<string> {
    const category = new CategoryEntity();
    category.name = name;
    const createdCategory = await this.categoryRepository.createCategory(
      category
    );
    if (!createdCategory.id) {
      throw new Error("Failed to create category: ID is undefined.");
    }
    return createdCategory.id;
  }

  async listCategories(
    page: number = 1,
    limit: number = 10
  ): Promise<CategoryEntity[]> {
    return await this.categoryRepository.listCategories(page, limit);
  }
}
