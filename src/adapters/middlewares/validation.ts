import { body, check } from "express-validator";
import { container } from "tsyringe";
import { UserRepository } from "../database/repositories/userRepository";
import { OrderItemEntity } from "../database/entities/OrderItemEntity";
const userRepository = container.resolve(UserRepository);
export const validateUser = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .custom(async (email) => {
      // Verifica se o e-mail já está registrado
      const user = await userRepository.getUserByEmail(email);
      if (user) {
        return Promise.reject("Email already registered");
      }
    }),
  body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const validateUserLogin = [
  body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
export const recoveryUser = [
  body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),
];
export const resetPasswordUser = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[@$!%*?&#]/)
    .withMessage("Password must contain a special character"),
];

export const validateProduct = [
  body("name")
    .isString()
    .withMessage("Product name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name must be between 1 and 100 characters long"),

  body("description")
    .isString()
    .withMessage("Product description must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Product description must be between 1 and 100 characters long"
    ),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a positive number"),

  body("categoryId").isUUID().withMessage("Category ID must be a valid UUID"),
];
export const validateOrder = [
  body("items")
    .isArray()
    .withMessage("Items must be an array")
    .notEmpty()
    .withMessage("Items array cannot be empty")
    .custom((items) => {
      items.forEach((item: OrderItemEntity) => {
        if (!item.productId || !item.name || !item.quantity || !item.price) {
          throw new Error(
            "Each item must have productId, name, quantity, and price"
          );
        }
        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error("Quantity must be a positive number");
        }
        if (typeof item.price !== "number" || item.price < 0) {
          throw new Error("Price must be a non-negative number");
        }
      });
      return true;
    }),

  body("status").optional().isString().withMessage("Status must be a string"),

  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("Created at must be a valid date in ISO8601 format"),

  body("updatedAt")
    .optional()
    .isISO8601()
    .withMessage("Updated at must be a valid date in ISO8601 format"),
];
export const paymentValidation = [
  check("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isUUID()
    .withMessage("Invalid Order ID format"),
  check("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["credit_card"])
    .withMessage("Invalid payment method"),
  check("paymentDetails.cardNumber")
    .notEmpty()
    .withMessage("Card number is required")
    .isCreditCard()
    .withMessage("Invalid card number"),
  check("paymentDetails.expiryDate")
    .notEmpty()
    .withMessage("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage("Invalid expiry date"),
  check("paymentDetails.cvv")
    .notEmpty()
    .withMessage("CVV is required")
    .isLength({ min: 3, max: 4 })
    .withMessage("Invalid CVV"),
];
