import { Router } from "express";
import { container } from "tsyringe";
import { CartController } from "@src/adapters/controllers/cartController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const cartController = container.resolve(CartController);
const url = `/api-ecommerce/cart`;

router.post("/api-ecommerce/cart", cartController.addItem.bind(cartController));

router.use(authMiddleware);
router.post(`${url}`, cartController.addItem.bind(cartController));
router.put(`${url}`, cartController.updateItem.bind(cartController));
router.delete(
  `${url}/:productId`,
  cartController.removeItem.bind(cartController)
);
router.get(`${url}`, cartController.getCart.bind(cartController));

export default router;
