import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { CartServiceInterface } from "@src/domain/services/cartServiceInterface";

@injectable()
export class CartController {
  constructor(
    @inject("CartService") private cartService: CartServiceInterface
  ) {}

  public async addItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productId, quantity } = req.body;
    const userId = req.decoded?.id as string;

    try {
      await this.cartService.addItem(productId, quantity, userId);
      res.status(200).json({ message: "Item added to cart" });
    } catch (error) {
      next(error);
    }
  }

  public async updateItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productId, quantity } = req.body;
    const userId = req.decoded?.id as string;

    try {
      await this.cartService.updateItem(productId, quantity, userId);
      res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async removeItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { productId } = req.params;
    const userId = req.decoded?.id as string;

    try {
      await this.cartService.removeItem(productId, userId);
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  }

  public async getCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.decoded?.id as string;

    try {
      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
}
