## E-commerce System Documentation

### Overview

This documentation outlines the development of a secure and robust e-commerce system using Node.js, Express, Redis, TypeORM, and PostgreSQL with a hexagonal architecture. The system covers a range of functionalities, from user authentication to product management and order processing.

### Table of Contents

- [E-commerce System Documentation](#e-commerce-system-documentation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Requirements Gathering](#requirements-gathering)
    - [Functional Requirements](#functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
  - [Technical Documentation](#technical-documentation)
    - [System Architecture](#system-architecture)
      - [Hexagonal Architecture (Ports and Adapters)](#hexagonal-architecture-ports-and-adapters)
    - [System Components](#system-components)
    - [Workflow](#workflow)
    - [Security](#security)
  - [Routes and Responses](#routes-and-responses)
    - [Authentication and Authorization](#authentication-and-authorization)
    - [Product Management](#product-management)
    - [Product not found](#product-not-found)
    - [Shopping Cart Management](#shopping-cart-management)
    - [Order Processing](#order-processing)
    - [Payments](#payments)
  - [Error Handling](#error-handling)
  - [Project Structure](#project-structure)

### Requirements Gathering

#### Functional Requirements

1. **Authentication and Authorization**
   - User registration (customers and administrators)
   - User login with JWT authentication
   - Session management
   - Password recovery
2. **Product Management**
   - CRUD (Create, Read, Update, Delete) operations for products
   - Product search and filtering
3. **Shopping Cart Management**
   - Adding, updating, and removing items in the cart
   - Viewing the cart
4. **Order Processing**
   - Creating orders from the shopping cart
   - Managing order status (pending, paid, shipped, delivered, canceled)
   - Order history
5. **Payments**
   - Integration with payment providers (e.g., Stripe, PayPal)
   - Secure payment processing
6. **User Management**
   - Viewing and updating user profile
   - User purchase history
7. **Administration**
   - Managing categories and products
   - Viewing sales reports

#### Non-Functional Requirements

1. **Security**
   - Password encryption (e.g., bcrypt)
   - Protection against brute force attacks (rate limiting)
   - Secure session token storage
   - Protection against XSS, CSRF, and SQL injection
2. **Scalability**
   - Using Redis for caching and session management
   - Ability to handle a large number of simultaneous transactions
3. **Performance**
   - Optimization of database queries
   - Implementation of caching for frequent queries
4. **Maintainability**
   - Modular and decoupled architecture
   - Unit and integration testing
   - Comprehensive code and API documentation
5. **Reliability**
   - Implementation of failover mechanisms
   - Monitoring and alerting

### Technical Documentation

#### System Architecture

##### Hexagonal Architecture (Ports and Adapters)

1. **Domain (Core)**
   - Domain models
   - Domain services
   - Repositories (interfaces)
2. **Application**
   - Application services
   - DTOs (Data Transfer Objects)
   - Use cases
3. **Adapters**
   - Controllers (HTTP request adaptation)
   - Infrastructure repositories (implementation of repository interfaces)
   - Payment providers
   - Redis clients
   - Middleware
4. **Configuration and Initialization**
   - Express server configuration
   - PostgreSQL database connection
   - Redis configuration

#### System Components

1. **Authentication and Authorization**
   - **Registration**: Route, application service, controller, user model, user repository
   - **Login**: Route, application service, controller, JWT authentication middleware
   - **Password Recovery**: Route, application service, controller, email service integration
2. **Product Management**
   - **Product CRUD**: Routes, application service, controller, product model, product repository
3. **Shopping Cart**
   - **Cart Management**: Routes, application service, controller, cart model, cart repository (using Redis)
4. **Order Processing**
   - **Order Creation and Management**: Routes, application service, controller, order model, order repository
5. **Payments**
   - **Payment Processing**: Integration with payment providers, payment service, payment controller
6. **Administration**
   - **Category and Product Management**: Admin routes, admin application service, admin controller, related models, and repositories

#### Workflow

1. **User Registration**
   - The client sends a registration request with user data.
   - The authentication controller validates the data and calls the authentication service.
   - The authentication service creates the user and saves it in the database.
2. **User Login**
   - The client sends a login request with email and password.
   - The authentication controller validates the data and calls the authentication service.
   - The authentication service verifies the credentials and returns a JWT token.
3. **Add Product to Cart**
   - The client sends a request to add a product to the cart.
   - The cart controller validates the data and calls the cart service.
   - The cart service updates the cart in Redis.
4. **Create Order**
   - The client sends a request to create an order from the cart.
   - The order controller validates the data and calls the order service.
   - The order service creates the order in the database and initiates the payment process.
5. **Process Payment**
   - The payment service integrates with the payment provider to process the transaction.
   - The payment controller receives the confirmation and updates the order status.

#### Security

1. **Authentication and Authorization**
   - Use JWT for authentication and authorization.
   - Password encryption with bcrypt.
   - Implementation of secure password policies (complexity, expiration).
2. **Protection Against Attacks**
   - Use helmet for protection against common attacks.
   - Rate limiting with express-rate-limit.
   - Validation and sanitization of user inputs.
3. **Secure Token Storage**
   - Secure session tokens storage using Redis.
   - Implementation of session expiration policies.

### Routes and Responses

#### Authentication and Authorization

1. **User Registration**

   - **Route**: `POST /auth/register`
   - **Request**:
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "password": "password123"
     }
     ```
   - **Success Response** (201 Created):
     ```json
     {
       "message": "User registered successfully",
       "userId": "12345"
     }
     ```
   - **Error Response** (400 Bad Request):
     ```json
     {
       "error": "Email already exists"
     }
     ```

2. **User Login**

   - **Route**: `POST /auth/login`
   - **Request**:
     ```json
     {
       "email": "john.doe@example.com",
       "password": "password123"
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "token": "jwt-token",
       "userId": "12345"
     }
     ```
   - **Error Response** (401 Unauthorized):
     ```json
     {
       "error": "Invalid credentials"
     }
     ```

3. **Password Recovery**
   - **Route**: `POST /auth/password-recovery`
   - **Request**:
     ```json
     {
       "email": "john.doe@example.com"
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Password recovery email sent"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error": "Email not found"
     }
     ```

#### Product Management

1. **Create Product**

   - **Route**: `POST /products`
   - **Request**:
     ```json
     {
       "name": "Product Name",
       "description": "Product Description",
       "price": 99.99,
       "categoryId": "123"
     }
     ```
   - **Success Response** (201 Created):
     ```json
     {
       "message": "Product created successfully",
       "productId": "12345"
     }
     ```
   - **Error Response** (400 Bad Request):
     ```json
     {
       "error": "Invalid product data"
     }
     ```

2. **Get Product by ID**

   - **Route**: `GET /products/:id`
   - **Success Response** (200 OK):
     ```json
     {
       "productId": "12345",
       "name": "Product Name",
       "description": "Product Description",
       "price": 99.99,
       "categoryId": "123",
       "createdAt": "2024-07-30T12:34:56Z",
       "updatedAt": "2024-07-30T12:34:56Z"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error": "Product not found"
     }
     ```

3. **Update Product**
   - **Route**: `PUT /products/:id`
   - **Request**:
     ```json
     {
       "name": "Updated Product Name",
       "description": "Updated Product Description",
       "price": 89.99
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Product updated successfully"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error":
     ```

#### Product not found

1. **Delete Product**
   - **Route**: `DELETE /products/:id`
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Product deleted successfully"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error": "Product not found"
     }
     ```

#### Shopping Cart Management

1. **Add Item to Cart**

   - **Route**: `POST /cart/items`
   - **Request**:
     ```json
     {
       "productId": "12345",
       "quantity": 2
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Item added to cart"
     }
     ```
   - **Error Response** (400 Bad Request):
     ```json
     {
       "error": "Invalid product or quantity"
     }
     ```

2. **View Cart**

   - **Route**: `GET /cart`
   - **Success Response** (200 OK):
     ```json
     {
       "items": [
         {
           "productId": "12345",
           "name": "Product Name",
           "quantity": 2,
           "price": 99.99,
           "total": 199.98
         }
       ],
       "total": 199.98
     }
     ```

3. **Remove Item from Cart**
   - **Route**: `DELETE /cart/items/:productId`
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Item removed from cart"
     }
     ```

#### Order Processing

1. **Create Order**

   - **Route**: `POST /orders`
   - **Request**:
     ```json
     {
       "paymentMethod": "credit_card",
       "shippingAddress": "123 Main St"
     }
     ```
   - **Success Response** (201 Created):
     ```json
     {
       "message": "Order created successfully",
       "orderId": "12345"
     }
     ```
   - **Error Response** (400 Bad Request):
     ```json
     {
       "error": "Invalid order data"
     }
     ```

2. **Get Order by ID**

   - **Route**: `GET /orders/:id`
   - **Success Response** (200 OK):
     ```json
     {
       "orderId": "12345",
       "status": "pending",
       "items": [
         {
           "productId": "12345",
           "name": "Product Name",
           "quantity": 2,
           "price": 99.99,
           "total": 199.98
         }
       ],
       "total": 199.98,
       "createdAt": "2024-07-30T12:34:56Z",
       "updatedAt": "2024-07-30T12:34:56Z"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error": "Order not found"
     }
     ```

3. **Update Order Status**
   - **Route**: `PUT /orders/:id/status`
   - **Request**:
     ```json
     {
       "status": "shipped"
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Order status updated successfully"
     }
     ```
   - **Error Response** (404 Not Found):
     ```json
     {
       "error": "Order not found"
     }
     ```

#### Payments

1. **Process Payment**
   - **Route**: `POST /payments`
   - **Request**:
     ```json
     {
       "orderId": "12345",
       "paymentMethod": "credit_card",
       "paymentDetails": {
         "cardNumber": "4111111111111111",
         "expiryDate": "12/24",
         "cvv": "123"
       }
     }
     ```
   - **Success Response** (200 OK):
     ```json
     {
       "message": "Payment processed successfully",
       "paymentId": "12345"
     }
     ```
   - **Error Response** (400 Bad Request):
     ```json
     {
       "error": "Invalid payment details"
     }
     ```

### Error Handling

1. **Global Error Handling Middleware**

   - Catch and handle all uncaught errors.
   - Log errors for debugging and monitoring.
   - Return standardized error responses to the client.

   ```typescript
   import { Request, Response, NextFunction } from "express";

   const errorHandler = (
     err: any,
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     console.error(err);
     res.status(err.status || 500).json({
       error: err.message || "Internal Server Error",
     });
   };

   export default errorHandler;
   ```

2. **Validation Error Handling**

   - Use express-validator for request validation.
   - Return validation errors in a consistent format.

   ```typescript
   import { validationResult } from "express-validator";

   const validate = (req: Request, res: Response, next: NextFunction) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     next();
   };

   export default validate;
   ```

### Project Structure

```plaintext
/project-root
├── src
│   ├── adapters
│   │   ├── controllers
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   └── purchaseController.ts
│   │   ├── database
│   │   │   ├── entities
│   │   │   │   ├── productEntity.ts
│   │   │   │   ├── userEntity.ts
│   │   │   │   └── purchaseEntity.ts
│   │   │   ├── migrations
│   │   │   │   └── ...
│   │   │   └── repositories
│   │   │       ├── productRepository.ts
│   │   │       ├── userRepository.ts
│   │   │       └── purchaseRepository.ts
│   │   ├── middlewares
│   │   │   └── authMiddleware.ts
│   │   ├── redis
│   │   │   └── redisClient.ts
│   │   ├── routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   └── purchaseRoutes.ts
│   │   └── server.ts
│   ├── application
│   │   ├── services
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   └── purchaseService.ts
│   │   └── dtos
│   │       ├── authDTO.ts
│   │       ├── productDTO.ts
│   │       └── purchaseDTO.ts
│   ├── domain
│   │   ├── models
│   │   │   ├── product.ts
│   │   │   ├── user.ts
│   │   │   └── purchase.ts
│   │   ├── repositories
│   │   │   ├── productRepositoryInterface.ts
│   │   │   ├── userRepositoryInterface.ts
│   │   │   └── purchaseRepositoryInterface.ts
│   │   └── services
│   │       ├── authServiceInterface.ts
│   │       ├── productServiceInterface.ts
│   │       └── purchaseServiceInterface.ts
│   └── index.ts
├── .env
├── ormconfig.js
├── package.json
└── tsconfig.json
```

This documentation provides a comprehensive overview of the e-commerce system, detailing the architecture, requirements, components, workflows, security measures, routes, error handling, and project structure. This should guide you through the development process, ensuring a scalable, maintainable, and secure application.
