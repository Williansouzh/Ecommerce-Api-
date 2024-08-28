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
  validateProduct,
  productController.createProduct.bind(productController)
);
routes.get(
  `${url}/:id`,
  validateProduct,
  productController.getProduct.bind(productController)
);
routes.put(
  `${url}/:id`,
  validateProduct,
  productController.updateProduct.bind(productController)
);
routes.delete(
  `${url}/:id`,
  productController.deleteProduct.bind(productController)
);

export default routes;
