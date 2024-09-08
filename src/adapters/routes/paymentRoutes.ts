import { container } from "tsyringe";
import { OrderController } from "../controllers/orderController";
import { Router } from "express";
import { paymentValidation, validateOrder } from "../middlewares/validation";
import { errorMiddleware } from "../middlewares/errorHandler";
import { authMiddleware } from "../middlewares/auth";
import { PaymentService } from "@src/application/services/paymentService";
import { PaymentController } from "../controllers/paymentController";

const router = Router();
const paymentController = container.resolve(PaymentController);
const url = "/api-ecommerce/payment";

router.use(authMiddleware);
router.post(
  `${url}`,
  paymentController.handlePaymentRequest.bind(paymentController)
);
export default router;
