import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { CartServiceInterface } from "@src/domain/services/cartServiceInterface";
import { CartItemDTO } from "@src/application/dtos/cartDTO";

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
    const { name, productId, price, quantity } = req.body as CartItemDTO;
    const userId = req.decoded?.userId as string;
    const item: CartItemDTO = {
      productId: productId,
      quantity: quantity,
      name: "",
      price: 0,
    };
    if (!userId) {
      throw new Error("User id is required");
    }
    try {
      await this.cartService.addItem(userId, item);
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
    const userId = req.decoded?.userId as string;

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
    const userId = req.decoded?.userId as string;

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
    const userId = req.decoded?.userId as string;

    try {
      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
}
