import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { validationResult } from "express-validator";

import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { ApiError } from "@src/utils/api-errors";

@injectable()
export class ProductController {
  constructor(
    @inject("ProductService")
    private readonly productService: ProductServiceInterface
  ) {}

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

  public async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const product = await this.productService.getProduct(id);
      if (!product) {
        return next(
          new ApiError(
            "Product not found",
            404,
            "productError",
            "Product Service"
          )
        );
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  public async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const dto: CreateProductDTO = req.body;
      const updatedProduct = await this.productService.updateProduct(id, dto);
      if (!updatedProduct) {
        return next(
          new ApiError(
            "Product not found",
            404,
            "productError",
            "Product Service"
          )
        );
      }
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const deleted = await this.productService.deleteProduct(id);
      if (!deleted) {
        return next(
          new ApiError(
            "Product not found",
            404,
            "productError",
            "Product Service"
          )
        );
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
