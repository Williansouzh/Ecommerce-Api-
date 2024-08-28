import { Router } from "express";
import { container } from "tsyringe";
import { CartController } from "@src/adapters/controllers/cartController";

const router = Router();
const cartController = container.resolve(CartController);

router.post("/cart", cartController.addItem.bind(cartController));
router.put("/cart", cartController.updateItem.bind(cartController));
router.delete(
  "/cart/:productId",
  cartController.removeItem.bind(cartController)
);
router.get("/cart", cartController.getCart.bind(cartController));

export default router;
