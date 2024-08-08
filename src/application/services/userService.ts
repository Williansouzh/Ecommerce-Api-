import "../../utils/module.alias";
import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";
import { UserRepositoryInterface } from "../../domain/repositories/userRepositoryInterface";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/userDTO";
import { UserEntity } from "../../adapters/database/entities/userEntity";
import AuthService from "./authService";
import { NotFoundError, UnauthorizedError } from "@src/utils/api-errors";

type LoggedUserDTO = Omit<LoginUserDTO, "password">;
@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject("UserRepository") private userRepository: UserRepositoryInterface
  ) {}

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.getUserByEmail(email);
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
  async loginUser(payload: LoginUserDTO): Promise<LoggedUserDTO> {
    const user = await this.userRepository.getUserByEmail(payload.email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await AuthService.comparePasswords(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const token = AuthService.generateToken(tokenPayload);

    return {
      token,
      email: user.email,
    };
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UserEntity | null> {
    return this.userRepository.update(id, dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
