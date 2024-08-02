import { injectable } from "tsyringe";
import { UserRepositoryInterface } from "../../../domain/repositories/userRepositoryInterface";
import { UserEntity } from "../entities/userEntity";
import { getRepository, Repository } from "typeorm";
import { AppDataSource } from "@src/data-source";

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } }) || null;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async update(
    id: string,
    user: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    await this.repository.update(id, user);
    return this.repository.findOne({ where: { id } }) || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
