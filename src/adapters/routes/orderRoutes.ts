import { container } from "tsyringe";
import { OrderController } from "../controllers/orderController";
import { Router } from "express";
import { validateOrder } from "../middlewares/validation";
import { errorMiddleware } from "../middlewares/errorHandler";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const orderController = container.resolve(OrderController);
const url = "/api-ecommerce/order";

router.use(authMiddleware);
router.post(
  `${url}`,
  //validateOrder,
  orderController.createOrder.bind(orderController)
);
router.get(url, orderController.getOrders.bind(orderController));
router.put(
  `${url}/:id/status`,
  orderController.updateOrderStatus.bind(orderController)
);
export default router;
