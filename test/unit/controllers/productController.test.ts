import "reflect-metadata"; // Required for tsyringe
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ProductController } from "@src/adapters/controllers/productController";
import { ProductServiceInterface } from "@src/domain/services/productServiceInterface";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { ApiError } from "@src/utils/api-errors";
import { validationResult } from "express-validator";
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const mockProductService = {
  createProduct: jest.fn(),
  getProduct: jest.fn(), // Add getProduct mock
  updateProduct: jest.fn(), // Add updateProduct mock
  deleteProduct: jest.fn(), // Add deleteProduct mock
};

container.register("ProductService", { useValue: mockProductService });

describe("ProductController", () => {
  let productController: ProductController;

  beforeEach(() => {
    productController = container.resolve(ProductController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      const req = {
        body: { name: "Test Product", price: 100 },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.createProduct.mockResolvedValue({ id: "1" });

      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
      });

      await productController.createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product created successfully",
        productId: "1",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return validation errors", async () => {
      const req = {
        body: {},
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      const validationErrors = {
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
      };

      (validationResult as unknown as jest.Mock).mockReturnValue(
        validationErrors
      );

      await productController.createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid input" }],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("getProduct", () => {
    it("should get a product successfully", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.getProduct.mockResolvedValue({
        id: "1",
        name: "Test Product",
      });

      await productController.getProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: "1", name: "Test Product" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return an error if product not found", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.getProduct.mockResolvedValue(null);

      await productController.getProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ApiError(
          "Product not found",
          404,
          "productError",
          "Product Service"
        )
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      const req = {
        params: { id: "1" },
        body: { name: "Updated Product", price: 150 },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.updateProduct.mockResolvedValue(true);

      await productController.updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product updated successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return an error if product not found during update", async () => {
      const req = {
        params: { id: "1" },
        body: { name: "Updated Product", price: 150 },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.updateProduct.mockResolvedValue(null);

      await productController.updateProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ApiError(
          "Product not found",
          404,
          "productError",
          "Product Service"
        )
      );
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.deleteProduct.mockResolvedValue(true);

      await productController.deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product deleted successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return an error if product not found during deletion", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      mockProductService.deleteProduct.mockResolvedValue(false);

      await productController.deleteProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new ApiError(
          "Product not found",
          404,
          "productError",
          "Product Service"
        )
      );
    });
  });
});
