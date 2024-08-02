import { UserEntity } from "@src/adapters/database/entities/userEntity";

export interface UserServiceInterface {
  getUserById(id: string): Promise<UserEntity | null>;
  getAllUsers(): Promise<UserEntity[]>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<boolean>;
}
