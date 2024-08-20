import { UserEntity } from "@src/adapters/database/entities/userEntity";

export interface UserRepositoryInterface {
  findOneByToken(resetPasswordToken: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
