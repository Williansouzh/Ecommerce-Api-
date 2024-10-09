import "reflect-metadata";
import { Router } from "express";
import { validateProduct } from "../middlewares/validation";
import { container } from "tsyringe";
import { ProductController } from "../controllers/productController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for Products
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Register a new product
 *     operationId: createProduct
 *     security:
 *       - BearerAuth: []  # Define the Bearer authentication without comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Computer"
 *               description:
 *                 type: string
 *                 example: "Computer machine"
 *               price:
 *                 type: number  # Allows decimal values for product price
 *                 example: 2999.99
 *               categoryId:
 *                 type: string  # String to represent ObjectId for categories
 *                 example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     responses:
 *       201:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Retrieve a product by its ID
 *     operationId: getProduct
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *           example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     responses:
 *       200:
 *         description: Product successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *                 name:
 *                   type: string
 *                   example: "Computer"
 *                 description:
 *                   type: string
 *                   example: "Computer machine"
 *                 price:
 *                   type: number
 *                   example: 2999.99
 *                 categoryId:
 *                   type: string
 *                   example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *       400:
 *         description: Invalid product ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID"
 *       404:
 *         description: Product not found
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
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product by its ID
 *     operationId: deleteProduct
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *           example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     responses:
 *       200:
 *         description: Product deleted sucessfuly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *                 name:
 *                   type: string
 *                   example: "Computer"
 *                 description:
 *                   type: string
 *                   example: "Computer machine"
 *                 price:
 *                   type: number
 *                   example: 2999.99
 *                 categoryId:
 *                   type: string
 *                   example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *       400:
 *         description: Invalid product ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID"
 *       404:
 *         description: Product not found
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
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product by its ID
 *     operationId: updateProduct
 *     security:
 *       - BearerAuth: []  # Bearer token authentication
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *           example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Computer"
 *               description:
 *                 type: string
 *                 example: "Computer machine"
 *               price:
 *                 type: number
 *                 example: 2999.99
 *               categoryId:
 *                 type: string
 *                 example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *                     name:
 *                       type: string
 *                       example: "Computer"
 *                     description:
 *                       type: string
 *                       example: "Computer machine"
 *                     price:
 *                       type: number
 *                       example: 2999.99
 *                     categoryId:
 *                       type: string
 *                       example: "5f8d0d2a4e30f4b8c8a1d3b8"
 *       400:
 *         description: Invalid product ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid ID"
 *       404:
 *         description: Product not found
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
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey  # Use apiKey for x-access-token
 *       in: header
 *       name: x-access-token  # Header name for the token
 *       description: Token for authenticating requests
 */

const routes = Router();
const url = "/api-ecommerce/products";

const productController = container.resolve(ProductController);
routes.use(authMiddleware);
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
