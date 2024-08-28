import { container } from "tsyringe";
import { OrderController } from "../controllers/orderController";
import { Router } from "express";
import { validateOrder } from "../middlewares/validation";

const router = Router();
const orderController = container.resolve(OrderController);
const url = "/api-ecommerce/auth";
router.post(
  `${url}/order`,
  validateOrder,
  orderController.createOrder.bind(orderController)
);

export default router;
