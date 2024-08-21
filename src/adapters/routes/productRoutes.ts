import "reflect-metadata";
import { Router } from "express";
import { validateProduct } from "../middlewares/validation";
import { container } from "tsyringe";
import { ProductController } from "../controllers/productController";

const routes = Router();
const url = "/api-ecommerce/products";

const productController = container.resolve(ProductController);

routes.post(
  `${url}`,
  productController.createProduct.bind(productController),
  validateProduct
);

export default routes;
