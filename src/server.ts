import "./utils/module.alias";
import "reflect-metadata";
import "./container";
import express, { Application } from "express";
import authRoutes from "./adapters/routes/authRoutes";
import productRoutes from "./adapters/routes/productRoutes";
import cartRoutes from "./adapters/routes/cartRoutes";
import orderRoutes from "./adapters/routes/orderRoutes";
import paymentRoutes from "./adapters/routes/paymentRoutes";
import adminRoutes from "./adapters/routes/adminRouter";
import { errorMiddleware } from "./adapters/middlewares/errorHandler";
import { DatabaseService } from "./adapters/database/connection";
import { UserRepository } from "./adapters/database/repositories/userRepository";
import { UserService } from "./application/services/userService";
import { UserRepositoryInterface } from "./domain/repositories/userRepositoryInterface";
import { UserServiceInterface } from "./domain/services/userServiceInterface";
import { container } from "tsyringe";
import { EmailService } from "./application/services/emailService";
import { swaggerDocs } from "./swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
export class App {
  readonly port: number;
  readonly app: Application;

  constructor() {
    this.app = express();
    this.port = this.getPortFromEnv();
    this.configureContainer();
    this.configureMiddleware();
  }

  private getPortFromEnv(): number {
    const port = parseInt(process.env.PORT as string, 10);
    if (isNaN(port)) {
      throw new Error("PORT environment variable is not set or invalid.");
    }
    return port;
  }

  private configureMiddleware(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureContainer(): void {
    container.register<UserServiceInterface>("UserService", {
      useClass: UserService,
    });
    container.register<UserRepositoryInterface>("UserRepository", {
      useClass: UserRepository,
    });
    container.registerSingleton(DatabaseService);

    container.registerSingleton(EmailService);
  }

  public getApp(): Application {
    return this.app;
  }

  public async init(): Promise<void> {
    this.setupExpress();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.setupRoutes();
    this.app.use(errorMiddleware);
  }

  private setupRoutes(): void {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    this.app.use(authRoutes);
    this.app.use(productRoutes);
    this.app.use(cartRoutes);
    this.app.use(orderRoutes);
    this.app.use(paymentRoutes);
    this.app.use(adminRoutes);
  }

  private async databaseSetup(): Promise<void> {
    try {
      const databaseService = container.resolve(DatabaseService);
      await databaseService.connect();
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`Server listening on port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    try {
      const databaseService = container.resolve(DatabaseService);
      await databaseService.close();
    } catch (error) {
      console.error("Error closing database connection:", error);
    }
  }
}
