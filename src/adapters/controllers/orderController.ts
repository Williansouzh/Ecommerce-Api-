import "reflect-metadata";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { OrderServiceInterface } from "@src/domain/services/orderServiceInterface";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { inject, injectable } from "tsyringe";
import { OrderEntity } from "../database/entities/orderEntity";

@injectable()
export class OrderController {
  constructor(
    @inject("OrderService") private orderService: OrderServiceInterface
  ) {}

  public async createOrder(
    req: Request<{}, {}, CreateOrderDTO>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.decoded?.userId;
    if (!userId) {
      return res.status(400).json({
        message: `User ID is required.`,
      });
    }

    try {
      const {
        items,
        totalPrice,
        status,
        createdAt,
        updatedAt,
        paymentDetails,
        paymentMethod,
      } = req.body;

      const dto: CreateOrderDTO = {
        userId,
        items,
        totalPrice,
        status,
        createdAt,
        updatedAt,
        paymentDetails,
        paymentMethod,
      };

      const order = await this.orderService.createOrder(dto);

      return res.status(201).json({
        message: "Order registered successfully",
        orderId: order.id,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return next({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
  public async getOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.decoded?.userId;
      if (!userId) {
        return res.status(400).json({
          message: `User ID is required.`,
        });
      }
      const orders: OrderEntity[] = await this.orderService.getOrdersByUser(
        userId
      );
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
  public async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.decoded?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const order = await this.orderService.getOrder(orderId);
      if (!order || order.userId !== userId) {
        return res
          .status(404)
          .json({ message: "Order not found or access denied." });
      }

      await this.orderService.updateOrder(orderId, { status });
      return res
        .status(200)
        .json({ message: "Order status updated successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
