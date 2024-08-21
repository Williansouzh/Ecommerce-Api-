import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { UserService } from "@src/application/services/userService";
import { UserRepositoryInterface } from "@src/domain/repositories/userRepositoryInterface";
import { UserServiceInterface } from "@src/domain/services/userServiceInterface";
import { DatabaseService } from "./adapters/database/connection";
import { EmailService } from "./application/services/emailService";
import { ProductServiceInterface } from "./domain/services/productServiceInterface";
import { EmailServiceInterface } from "./domain/services/emailServiceInterface";
import ProductService from "./application/services/productService";
import { ProductRepositoryInterface } from "./domain/repositories/productRepositoryInterface";
import { ProductRepository } from "./adapters/database/repositories/productRepository";

container.register<UserRepositoryInterface>("UserRepository", {
  useClass: UserRepository,
});
container.register<ProductRepositoryInterface>("ProductRepository", {
  useClass: ProductRepository,
});
container.register<UserServiceInterface>("UserService", {
  useClass: UserService,
});
container.register<EmailServiceInterface>("EmailService", {
  useClass: EmailService,
});

container.register<ProductServiceInterface>("ProductService", {
  useClass: ProductService,
});

container.registerSingleton(DatabaseService);
