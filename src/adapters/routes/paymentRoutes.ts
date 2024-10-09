import { container } from "tsyringe";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { PaymentController } from "../controllers/paymentController";
/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Operations related to payment functionalities
 */

/**
 * @swagger
 * /api-ecommerce/payment:
 *   post:
 *     tags: [Payment]
 *     summary: Handle payment request
 *     operationId: handlePaymentRequest
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order123"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *               paymentDetails:
 *                 type: object
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                     example: "4111111111111111"
 *                   expirationDate:
 *                     type: string
 *                     example: "12/25"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment processed successfully"
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       403:
 *         description: User ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User id not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
const router = Router();
const paymentController = container.resolve(PaymentController);
const url = "/api-ecommerce/payment";

router.use(authMiddleware);
router.post(
  `${url}`,
  paymentController.handlePaymentRequest.bind(paymentController)
);
export default router;
