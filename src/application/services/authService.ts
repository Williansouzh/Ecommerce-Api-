import "reflect-metadata";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserEntity } from "@src/adapters/database/entities/userEntity";
import { injectable } from "tsyringe";
dotenv.config();
export interface DecodedUser extends Omit<UserEntity, "id"> {
  userId: string;
}
export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.APP_AUTH_KEY as jwt.Secret, {
      expiresIn: process.env.APP_AUTH_TOKEN_EXPIRE,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(
      token,
      process.env.APP_AUTH_KEY as jwt.Secret
    ) as DecodedUser;
  }
}
