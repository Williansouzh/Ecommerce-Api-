import "reflect-metadata";
import { container } from "tsyringe";

// Adapters
import { DatabaseService } from "./adapters/database/connection";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { ProductRepository } from "./adapters/database/repositories/productRepository";
import { CartRepository } from "./adapters/database/repositories/cartRepository";
import { OrderRepository } from "./adapters/database/repositories/orderRepository";
// Services
import { UserService } from "@src/application/services/userService";
import { EmailService } from "./application/services/emailService";
import ProductService from "./application/services/productService";
import { CartService } from "./application/services/cartService";
import { OrderService } from "./application/services/orderService";
// Interfaces
import { OrderServiceInterface } from "./domain/services/orderServiceInterface";
import { UserRepositoryInterface } from "@src/domain/repositories/userRepositoryInterface";
import { UserServiceInterface } from "@src/domain/services/userServiceInterface";
import { EmailServiceInterface } from "./domain/services/emailServiceInterface";
import { ProductServiceInterface } from "./domain/services/productServiceInterface";
import { CartServiceInterface } from "./domain/services/cartServiceInterface";
import { ProductRepositoryInterface } from "./domain/repositories/productRepositoryInterface";
import { OrderRepositoryInterface } from "./domain/repositories/orderRepositoryInterface";
import { CartRepositoryInterface } from "./domain/repositories/cartRepositoryInterface";

// Dependency Injection Registration
container.register<OrderRepositoryInterface>("OrderRepository", {
  useClass: OrderRepository,
});
container.register<UserRepositoryInterface>("UserRepository", {
  useClass: UserRepository,
});
container.register<ProductRepositoryInterface>("ProductRepository", {
  useClass: ProductRepository,
});
container.register<CartRepositoryInterface>("CartRepository", {
  useClass: CartRepository,
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
container.register<CartServiceInterface>("CartService", {
  useClass: CartService,
});

container.register<OrderServiceInterface>("OrderService", {
  useClass: OrderService,
});

// Singleton Registration
container.registerSingleton(DatabaseService);
