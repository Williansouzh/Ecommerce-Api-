import "reflect-metadata";
import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/authController";
import { validateUser } from "../middlewares/validation";
import { authMiddleware } from "../middlewares/auth";
import { AdminController } from "../controllers/AdminController";
/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Operations related to admin functionalities
 */

/**
 * @swagger
 * /admin/sales:
 *   get:
 *     tags: [Admin]
 *     summary: Get sales report
 *     operationId: getSalesReport
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   example: 10000.00
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
 * /admin/category:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new category
 *     operationId: createCategory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 categoryId:
 *                   type: string
 *                   example: "category123"
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
 * /admin/category:
 *   get:
 *     tags: [Admin]
 *     summary: List all categories
 *     operationId: listCategories
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "category123"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
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
const routes = Router();
const url = "/api-ecommerce/admin";
const adminController = container.resolve(AdminController);

routes.use(authMiddleware);

routes.get(
  `${url}/sales`,
  validateUser,
  adminController.getSalesReport.bind(adminController)
);
routes.post(
  `${url}/category`,
  adminController.createCategory.bind(adminController)
);
routes.get(
  `${url}/category`,

  adminController.listCategories.bind(adminController)
);

export default routes;
