import "reflect-metadata";
import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/authController";
import { validateUser, validateUserLogin } from "../middlewares/validation";

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

export default routes;
