export interface SalesRepositoryInterface {
  getTotalSalesSummary(): Promise<{ totalAmount: number; totalSales: number }>;
}
