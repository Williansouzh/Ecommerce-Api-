import "reflect-metadata";
import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/authController";
import { validateUser } from "../middlewares/validation";
import { authMiddleware } from "../middlewares/auth";
import { AdminController } from "../controllers/AdminController";

const routes = Router();
const url = "/api-ecommerce/admin";
const adminController = container.resolve(AdminController);

routes.use(authMiddleware);

routes.get(
  `${url}/sales`,
  validateUser,
  adminController.getSalesReport.bind(adminController)
);
routes.post(
  `${url}/category`,
  adminController.createCategory.bind(adminController)
);
routes.get(
  `${url}/category`,
  adminController.listCategories.bind(adminController)
);

export default routes;
