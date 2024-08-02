import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { UserService } from "@src/application/services/userService";
import { UserRepositoryInterface } from "@src/domain/repositories/userRepositoryInterface";
import { UserServiceInterface } from "@src/domain/services/userServiceInterface";
import { DatabaseService } from "./adapters/database/connection";

container.register<UserRepositoryInterface>("UserRepository", {
  useClass: UserRepository,
});

container.register<UserServiceInterface>("UserService", {
  useClass: UserService,
});

container.registerSingleton(DatabaseService);
