import { injectable } from "tsyringe";
import { DataSource } from "typeorm";
import { AppDataSource } from "@src/data-source";

@injectable()
export class DatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  async connect(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log("Database connected.");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.dataSource.destroy();
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Failed to close database connection:", error);
    }
  }
}
