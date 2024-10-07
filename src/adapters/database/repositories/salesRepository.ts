import "reflect-metadata";
import { SalesRepositoryInterface } from "@src/domain/repositories/salesRepositoryInterface";
import { Repository } from "typeorm";
import { SaleEntity } from "../entities/salesEntity";
import { AppDataSource } from "@src/data-source";
import { injectable } from "tsyringe";

@injectable()
export class SalesRepository implements SalesRepositoryInterface {
  private repository: Repository<SaleEntity>;
  constructor() {
    this.repository = AppDataSource.getRepository(SaleEntity);
  }
  async createSale(saleData: Partial<SaleEntity>): Promise<SaleEntity> {
    const sale = this.repository.create(saleData);
    return await this.repository.save(sale);
  }
  async getTotalSales(): Promise<number> {
    try {
      const result = await this.repository
        .createQueryBuilder("sales")
        .select("SUM(sales.amount)", "totalSales")
        .getRawOne();
      return result?.totalSales || 0;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(
        "Error during getTotal Sales repository: " + errorMessage
      );
    }
  }
}
