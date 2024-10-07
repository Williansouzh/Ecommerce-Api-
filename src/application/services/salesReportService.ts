import "reflect-metadata";
import { SalesRepository } from "@src/adapters/database/repositories/salesRepository";
import { SalesReportServiceInterface } from "@src/domain/services/salesReportServiceInterface";
import { inject, injectable } from "tsyringe";

@injectable()
export class SalesReportService implements SalesReportServiceInterface {
  constructor(
    @inject("SalesRepository") private salesRepository: SalesRepository
  ) {}
  async getTotalSales(): Promise<{ totalAmount: number; totalSales: number }> {
    const result = await this.salesRepository.getTotalSalesSummary();
    return {
      totalAmount: result.totalAmount || 0,
      totalSales: result.totalSales || 0,
    };
  }
}
