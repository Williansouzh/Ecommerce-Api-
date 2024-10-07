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
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     operationId: registerNewUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe123@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Strong*password1"
 *               confirmPassword:
 *                 type: string
 *                 example: "Strong*password1"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already in use"
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     operationId: userLogin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe123@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Strong*password1"
 *               confirmPassword:
 *                 type: string
 *                 example: "Strong*password1"
 *     responses:
 *       201:
 *         description: Login successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successfully"
 *       403:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email or passwod wrong"
 */
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
