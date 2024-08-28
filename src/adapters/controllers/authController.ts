import "reflect-metadata";
import "../../utils/module.alias";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { UserServiceInterface } from "../../domain/services/userServiceInterface";
import { CreateUserDTO, LoginUserDTO } from "@src/application/dtos/userDTO";
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
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const dto: CreateUserDTO = req.body;
      const user = await this.userService.createUser(dto);
      res
        .status(201)
        .json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
      next(error);
    }
  }
  public async userLogin(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const dto: LoginUserDTO = req.body;
      const loggedUser = await this.userService.loginUser(dto);
      res.status(200).json(loggedUser);
    } catch (error) {
      next(error);
    }
  }
  public async passwordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = req.params.token;
      const { newPassword } = req.body;
      await this.userService.passwordReset(token, newPassword);

      res.status(200).json({ message: "Password successfully updated." });
    } catch (error) {
      return next(error);
    }
  }

  public async passwordRecovery(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const email: string = req.body.email;

      await this.userService.passwordRecovery(email);

      res.status(200).json({ message: "Password recovery email sent." });
    } catch (error) {
      return next(error);
    }
  }
}
