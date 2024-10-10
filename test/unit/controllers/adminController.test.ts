import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { mock, MockProxy } from "jest-mock-extended";
import { AdminController } from "@src/adapters/controllers/AdminController";
import { CategoryServiceInterface } from "@src/domain/services/categoryServiceInterface";
import { SalesReportServiceInterface } from "@src/domain/services/salesReportServiceInterface";
import { ApiError } from "@src/utils/api-errors";
import { validationResult } from "express-validator";
import { CategoryEntity } from "@src/adapters/database/entities/categoryEntity";

describe("AdminController", () => {
  let adminController: AdminController;
  let mockCategoryService: MockProxy<CategoryServiceInterface>;
  let mockSalesReportService: MockProxy<SalesReportServiceInterface>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockCategoryService = mock<CategoryServiceInterface>();
    mockSalesReportService = mock<SalesReportServiceInterface>();

    adminController = new AdminController(
      mockCategoryService,
      mockSalesReportService
    );

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      mockRequest = {
        body: { name: "New Category" },
      } as Partial<Request>;

      mockCategoryService.createCategory.mockResolvedValue("category-123");

      await adminController.createCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith(
        "New Category"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Category created successfully",
        categoryId: "category-123",
      });
    });

    it("should handle errors during category creation", async () => {
      mockRequest = {
        body: { name: "New Category" },
      } as Partial<Request>;

      mockCategoryService.createCategory.mockRejectedValue(
        new Error("Service error")
      );

      await adminController.createCategory(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError(
          "Error deleting order",
          500,
          "Service error",
          "Admin Controller"
        )
      );
    });
  });

  describe("listCategories", () => {
    it("should return a list of categories", async () => {
      const mockCategories: CategoryEntity[] = [
        {
          name: "name",
          products: [],
        },
      ];
      mockCategoryService.listCategories.mockResolvedValue(mockCategories);

      await adminController.listCategories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockCategoryService.listCategories).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        categories: mockCategories,
      });
    });

    it("should handle errors while listing categories", async () => {
      mockCategoryService.listCategories.mockRejectedValue(
        new Error("Error fetching categories")
      );

      await adminController.listCategories(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError(
          "Error listing categories",
          500,
          "Error fetching categories",
          "Admin Controller"
        )
      );
    });
  });

  describe("getSalesReport", () => {
    it("should return total sales", async () => {
      const totalSales = {
        totalAmount: 1000,
        totalSales: 5000,
      };
      mockSalesReportService.getTotalSales.mockResolvedValue(totalSales);

      await adminController.getSalesReport(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockSalesReportService.getTotalSales).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ totalSales });
    });

    it("should handle errors while fetching sales report", async () => {
      mockSalesReportService.getTotalSales.mockRejectedValue(
        new Error("Error fetching sales report")
      );

      await adminController.getSalesReport(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError(
          "Error fetching sales report",
          500,
          "Error fetching sales report",
          "Admin Controller"
        )
      );
    });
  });
});
