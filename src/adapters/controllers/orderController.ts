import "reflect-metadata";
import { CreateOrderDTO } from "@src/application/dtos/orderDTO";
import { OrderServiceInterface } from "@src/domain/services/orderServiceInterface";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { inject, injectable } from "tsyringe";

@injectable()
export class OrderController {
  constructor(
    @inject("OrderService") private orderService: OrderServiceInterface
  ) {}

  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dto: CreateOrderDTO = req.body;
      const order = await this.orderService.createOrder(dto);

      return res
        .status(201)
        .json({ message: "Order registered successfully", orderId: order.id });
    } catch (error) {
      next(error);
    }
  }
}
