import "../../utils/module.alias";
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";
import { CreateUserDTO } from "@src/application/dtos/userDTO";
import { validationResult } from "express-validator";

@injectable()
export class AuthController {
  constructor(
    @inject("UserService") private userService: UserServiceInterface
  ) {}

  public async registerNewUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const dto: CreateUserDTO = req.body;
      const user = await this.userService.createUser(dto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
