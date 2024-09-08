import { PaymentService } from "@src/application/services/paymentService";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentController {
  constructor(
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

    try {
      const result = await this.paymentService.processPayment(
        orderId,
        paymentMethod,
        paymentDetails
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
