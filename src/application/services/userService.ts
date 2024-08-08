import "../../utils/module.alias";
import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";
import { UserRepositoryInterface } from "../../domain/repositories/userRepositoryInterface";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/userDTO";
import { UserEntity } from "../../adapters/database/entities/userEntity";
import AuthService from "./authService";

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject("UserRepository") private userRepository: UserRepositoryInterface
  ) {}

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async createUser(dto: CreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = dto.name;
    user.email = dto.email;
    user.password = await AuthService.hashPassword(dto.password);
    return this.userRepository.create(user);
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UserEntity | null> {
    return this.userRepository.update(id, dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
