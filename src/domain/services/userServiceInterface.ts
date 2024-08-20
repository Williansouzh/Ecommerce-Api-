import { UserEntity } from "@src/adapters/database/entities/userEntity";
import { CreateUserDTO, LoginUserDTO } from "@src/application/dtos/userDTO";
import { LoggedUserDTO } from "@src/types/userTypes";

export interface UserServiceInterface {
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getAllUsers(): Promise<UserEntity[]>;
  createUser(user: CreateUserDTO): Promise<UserEntity>;
  updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
  loginUser(payload: LoginUserDTO): Promise<LoggedUserDTO>;
  passwordRecovery(email: string): Promise<string>;
  passwordReset(token: string, newPassword: string): Promise<void>;
}
