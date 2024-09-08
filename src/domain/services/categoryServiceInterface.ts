import { CategoryEntity } from "@src/adapters/database/entities/categoryEntity";

export interface CategoryServiceInterface {
  createCategory(name: string): Promise<string>;
  listCategories(): Promise<CategoryEntity[]>;
}
