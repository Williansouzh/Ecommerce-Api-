import "../../utils/module.alias";
import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";
import { UserRepositoryInterface } from "../../domain/repositories/userRepositoryInterface";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/userDTO";
import { UserEntity } from "../../adapters/database/entities/userEntity";
import AuthService from "./authService";
import { NotFoundError, UnauthorizedError } from "@src/utils/api-errors";
import { EmailService } from "./emailService";
import bcrypt from "bcrypt";
import crypto from "crypto";
type LoggedUserDTO = Omit<LoginUserDTO, "password">;
@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject("UserRepository") private userRepository: UserRepositoryInterface,
    @inject("EmailService") private emailService: EmailService
  ) {}
  async passwordReset(token: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOneByToken(token);

      if (
        !user?.id ||
        !user.resetPasswordExpires ||
        user.resetPasswordExpires < new Date()
      ) {
        throw new Error("Invalid or expired token.");
      }

      user.password = await this.hashPassword(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await this.userRepository.update(user.id, user);
    } catch (error) {
      console.error("Error resetting password:", error);

      throw new Error("Failed to reset password. Please try again later.");
    }
  }

  async passwordRecovery(email: string): Promise<string> {
    try {
      const user = await this.getUserByEmail(email);

      if (!user?.id) {
        throw new NotFoundError("User not found");
      }

      const token = this.generateResetToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = this.getResetPasswordExpiryDate();

      await this.userRepository.update(user.id, user);

      await this.emailService.sendTokenResetEmail(user.email, user.name, token);

      return token;
    } catch (error) {
      console.error("Error processing password recovery:", error);

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new Error(
        "Failed to process password recovery. Please try again later."
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  private generateResetToken(): string {
    return crypto.randomBytes(20).toString("hex");
  }

  private getResetPasswordExpiryDate(): Date {
    return new Date(Date.now() + 3600000);
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.getUserByEmail(email);
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
