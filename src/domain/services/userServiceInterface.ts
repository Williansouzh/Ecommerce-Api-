import { UserEntity } from "@src/adapters/database/entities/userEntity";
import { LoginUserDTO } from "@src/application/dtos/userDTO";
import { LoggedUserDTO } from "@src/types/userTypes";

export interface UserServiceInterface {
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getAllUsers(): Promise<UserEntity[]>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
  loginUser(payload: LoginUserDTO): Promise<LoggedUserDTO>;
}
