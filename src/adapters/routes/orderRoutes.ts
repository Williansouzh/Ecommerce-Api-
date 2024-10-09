import { container } from "tsyringe";
import { OrderController } from "../controllers/orderController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to the orders
 */

/**
 * @swagger
 * /api-ecommerce/order:
 *   post:
 *     tags: [Order]
 *     summary: Register a new order
 *     operationId: createOrder
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order registered successfully"
 *                 orderId:
 *                   type: string
 *                   example: "order123"
 *       400:
 *         description: Invalid input
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
 */

/**
 * @swagger
 * /api-ecommerce/order:
 *   get:
 *     tags: [Order]
 *     summary: Retrieve all orders for a user
 *     operationId: getOrders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "order123"
 *                   userId:
 *                     type: string
 *                     example: "12345"
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                           example: "abcde12345"
 *                         name:
 *                           type: string
 *                           example: "Computer"
 *                         quantity:
 *                           type: integer
 *                           example: 1
 *                         price:
 *                           type: number
 *                           example: 2999.99
 *                   totalPrice:
 *                     type: number
 *                     example: 2999.99
 *                   paymentMethod:
 *                     type: string
 *                     example: "Credit Card"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-09T10:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-10-09T10:00:00Z"
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required."
 * */
/**
 * @swagger
 * /api-ecommerce/order/{id}/status:
 *   put:
 *     tags: [Order]
 *     summary: Update the status of an order
 *     operationId: updateOrderStatus
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: string
 *           example: "order123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order status updated successfully"
 *       400:
 *         description: Invalid input or user ID required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required."
 *       404:
 *         description: Order not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found or access denied."
 */

/**
 * @swagger
 * /api-ecommerce/order/{id}:
 *   delete:
 *     tags: [Order]
 *     summary: Delete an order
 *     operationId: deleteOrder
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: string
 *           example: "order123"
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order deleted successfully"
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required."
 *       404:
 *         description: Order not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found or access denied."
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 *       description: Token for authenticating requests
 */
const router = Router();
const orderController = container.resolve(OrderController);
const url = "/api-ecommerce/order";

router.use(authMiddleware);
router.post(`${url}`, orderController.createOrder.bind(orderController));
router.get(url, orderController.getOrders.bind(orderController));
router.put(
  `${url}/:id/status`,
  orderController.updateOrderStatus.bind(orderController)
);
export default router;
