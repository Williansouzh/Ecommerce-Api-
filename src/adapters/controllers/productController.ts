import "reflect-metadata";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProductController {
  constructor(
    @inject("ProductService") private productService: ProductServiceInterface
  ) {}

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      const dto: CreateProductDTO = req.body;
      const product = await this.productService.createProduct(dto);
      res.status(201).json({
        message: "Product created successfully",
        productId: product.id,
      });
    } catch (error) {
      next(error);
    }
  }
}
