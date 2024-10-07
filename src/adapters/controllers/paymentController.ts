import { CartService } from "@src/application/services/cartService";
import { PaymentService } from "@src/application/services/paymentService";
import { ApiError } from "@src/utils/api-errors";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentController {
  constructor(
    @inject("CartService") private cartService: CartService,
    @inject("PaymentService") private paymentService: PaymentService
  ) {}

  async handlePaymentRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentMethod, paymentDetails } = req.body;

    const userId = req.decoded?.userId;
    if (!userId) {
      throw new ApiError(
        "User id not found",
        403,
        "PaymentController",
        "PaymentController"
      );
    }
    try {
      const result = await this.paymentService.processPayment(
        orderId,
        paymentMethod,
        paymentDetails
      );
      if (result && userId) {
        await this.cartService.removeAll(userId);
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
