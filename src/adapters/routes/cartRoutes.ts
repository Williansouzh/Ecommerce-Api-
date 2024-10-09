import { Router } from "express";
import { container } from "tsyringe";
import { CartController } from "@src/adapters/controllers/cartController";
import { authMiddleware } from "../middlewares/auth";
/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Operations related to the shopping cart
 */

/**
 * @swagger
 * /api-ecommerce/cart:
 *   post:
 *     tags: [Cart]
 *     summary: Add an item to the cart
 *     operationId: addItemToCart
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop"
 *               productId:
 *                 type: string
 *                 example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *               price:
 *                 type: number
 *                 example: 1499.99
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid product ID or quantity"
 */

/**
 * @swagger
 * /api-ecommerce/cart:
 *   put:
 *     tags: [Cart]
 *     summary: Update an item in the cart
 *     operationId: updateItemInCart
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart updated successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid product ID or quantity"
 */

/**
 * @swagger
 * /api-ecommerce/cart/{productId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove an item from the cart
 *     operationId: removeItemFromCart
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to remove from the cart
 *         schema:
 *           type: string
 *           example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item removed from cart"
 *       404:
 *         description: Product not found in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 */

/**
 * @swagger
 * /api-ecommerce/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Retrieve the user's cart
 *     operationId: getCart
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *                       name:
 *                         type: string
 *                         example: "Laptop"
 *                       price:
 *                         type: number
 *                         example: 1499.99
 *                       quantity:
 *                         type: integer
 *                         example: 1
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cart not found"
 */

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
