import "reflect-metadata";
import { UserRepository } from "@src/adapters/database/repositories/userRepository";
import { UserEntity } from "@src/adapters/database/entities/userEntity";
import { mock, MockProxy } from "jest-mock-extended";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "@src/data-source";
import { container } from "tsyringe";
describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mockRepository: MockProxy<Repository<UserEntity>>;

  beforeEach(() => {
    mockRepository = mock<Repository<UserEntity>>();

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue(mockRepository);

    userRepository = container.resolve(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const userEntity = new UserEntity();
    userEntity.email = "test@example.com";

    mockRepository.save.mockResolvedValue(userEntity);

    const result = await userRepository.create(userEntity);

    expect(mockRepository.save).toHaveBeenCalledWith(userEntity);
    expect(result).toEqual(userEntity);
  });

  it("should find a user by id", async () => {
    const userId = "user-123";
    const userEntity = new UserEntity();
    userEntity.id = userId;

    mockRepository.findOne.mockResolvedValue(userEntity);

    const result = await userRepository.findById(userId);

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual(userEntity);
  });

  it("should find a user by email", async () => {
    const email = "test@example.com";
    const userEntity = new UserEntity();
    userEntity.email = email;

    mockRepository.findOne.mockResolvedValue(userEntity);

    const result = await userRepository.getUserByEmail(email);

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(result).toEqual(userEntity);
  });

  it("should update a user", async () => {
    const userId = "user-123";
    const updateData = { email: "updated@example.com" };
    const updatedUser = new UserEntity();
    updatedUser.id = userId;
    updatedUser.email = "updated@example.com";

    const mockUpdateResult: UpdateResult = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };

    mockRepository.update.mockResolvedValue(mockUpdateResult);
    mockRepository.findOne.mockResolvedValue(updatedUser);

    const result = await userRepository.update(userId, updateData);

    expect(mockRepository.update).toHaveBeenCalledWith(userId, updateData);
    expect(result).toEqual(updatedUser);
  });

  it("should delete a user", async () => {
    const userId = "user-123";

    const mockDeleteResult: DeleteResult = {
      raw: {},
      affected: 1,
    };

    mockRepository.delete.mockResolvedValue(mockDeleteResult);

    const result = await userRepository.delete(userId);

    expect(mockRepository.delete).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });

  it("should delete a user", async () => {
    const userId = "user-123";

    const mockDeleteResult: DeleteResult = {
      raw: {},
      affected: 1,
    };

    mockRepository.delete.mockResolvedValue(mockDeleteResult);

    const result = await userRepository.delete(userId);

    expect(mockRepository.delete).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });

  it("should find all users", async () => {
    const users = [new UserEntity(), new UserEntity()];

    mockRepository.find.mockResolvedValue(users);

    const result = await userRepository.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it("should clear all users", async () => {
    mockRepository.clear.mockResolvedValue(undefined);

    await userRepository.clear();

    expect(mockRepository.clear).toHaveBeenCalled();
  });
});
