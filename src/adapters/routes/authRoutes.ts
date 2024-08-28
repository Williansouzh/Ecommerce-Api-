import "reflect-metadata";
import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/authController";
import {
  recoveryUser,
  resetPasswordUser,
  validateUser,
  validateUserLogin,
} from "../middlewares/validation";
import { authMiddleware } from "../middlewares/auth";

const routes = Router();
const url = "/api-ecommerce/auth";
const authController = container.resolve(AuthController);

routes.post(
  `${url}/register`,
  validateUser,
  authController.registerNewUser.bind(authController)
);
routes.post(
  `${url}/login`,
  validateUserLogin,
  authController.userLogin.bind(authController)
);
routes.post(
  `${url}/password-recovery`,
  recoveryUser,
  authController.passwordRecovery.bind(authController)
);
routes.post(
  `${url}/reset-password/:token`,
  resetPasswordUser,
  authController.passwordReset.bind(authController)
);

export default routes;
