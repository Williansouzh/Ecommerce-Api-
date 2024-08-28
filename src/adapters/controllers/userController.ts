import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";

@injectable()
export class UserController {
  constructor(
    @inject("UserService") private userService: UserServiceInterface
  ) {}

  public async getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
