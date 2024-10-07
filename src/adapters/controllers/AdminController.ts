import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { CategoryServiceInterface } from "@src/domain/services/categoryServiceInterface";
import { SalesReportServiceInterface } from "@src/domain/services/salesReportServiceInterface";
import { validationResult } from "express-validator";
import { ApiError } from "@src/utils/api-errors";

@injectable()
export class AdminController {
  constructor(
    @inject("CategoryService")
    private categoryService: CategoryServiceInterface,
    @inject("SalesReportService")
    private salesReportService: SalesReportServiceInterface
  ) {}
  public async createCategory(
    req: Request<{}, {}, { name: string }>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
      const categoryId = await this.categoryService.createCategory(name);
      return res.status(201).json({
        message: "Category created successfully",
        categoryId,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        return next(
          new ApiError(
            "Error deleting order",
            500,
            error.message,
            "Admin Controller"
          )
        );
      } else {
        return next(
          new ApiError(
            "Unknown error",
            500,
            "An unexpected error occurred",
            "Admin Controller"
          )
        );
      }
    }
  }
  public async listCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const categories = await this.categoryService.listCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      console.error("Error listing categories:", error);
      if (error instanceof Error) {
        return next(
          new ApiError(
            "Error listing categories",
            500,
            error.message,
            "Admin Controller"
          )
        );
      } else {
        new ApiError(
          "Error listing categories",
          500,
          "Unexpected error",
          "Admin Controller"
        );
      }
    }
  }
  public async getSalesReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const totalSales: number = await this.salesReportService.getTotalSales();
      return res.status(200).json({ totalSales });
    } catch (error) {
      console.error("Error fetching sales report:", error);
      if (error instanceof Error) {
        return next(
          new ApiError(
            "Error fetching sales report",
            500,
            error.message,
            "Admin Controller"
          )
        );
      } else {
        return next(
          new ApiError(
            "Error fetching sales report",
            500,
            "Unexpected Error",
            "Admin Controller"
          )
        );
      }
    }
  }
}
