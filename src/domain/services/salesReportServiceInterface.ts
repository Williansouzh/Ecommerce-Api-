export interface SalesReportServiceInterface {
  getTotalSales(): Promise<{ totalAmount: number; totalSales: number }>;
}
