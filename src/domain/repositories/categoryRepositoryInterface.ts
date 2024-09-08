import { CategoryEntity } from "@src/adapters/database/entities/categoryEntity";

export interface CategoryRepositoryInterface {
  createCategory(category: CategoryEntity): Promise<Promise<CategoryEntity>>;
  listCategories(page: number, limit: number): Promise<CategoryEntity[]>;
}
