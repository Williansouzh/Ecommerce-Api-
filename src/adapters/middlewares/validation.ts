import { body } from "express-validator";

export const validateUser = [
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
