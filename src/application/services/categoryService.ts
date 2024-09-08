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
    return createdCategory.id;
  }

  async listCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.listCategories();
  }
}
