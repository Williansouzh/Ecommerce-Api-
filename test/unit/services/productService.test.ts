import "reflect-metadata";
import { mock, MockProxy } from "jest-mock-extended";
import ProductService from "@src/application/services/productService";
import { ProductRepositoryInterface } from "@src/domain/repositories/productRepositoryInterface";
import { ProductEntity } from "@src/adapters/database/entities/productEntity";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { container } from "tsyringe";

describe("ProductService", () => {
  let productService: ProductService;
  let productRepository: MockProxy<ProductRepositoryInterface>;

  beforeEach(() => {
    productRepository = mock<ProductRepositoryInterface>();

    container.registerInstance("ProductRepository", productRepository);
    productService = container.resolve(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product", async () => {
    const productDTO: CreateProductDTO = {
      name: "Product 1",
      price: 100,
      description: "A sample product",
      categoryId: "",
    };

    const productEntity = new ProductEntity();
    Object.assign(productEntity, productDTO);
    productEntity.id = "product-123";

    productRepository.createProduct.mockResolvedValue(productEntity);

    const result = await productService.createProduct(productDTO);

    expect(productRepository.createProduct).toHaveBeenCalledWith(
      expect.any(ProductEntity)
    );
    expect(result).toEqual(productEntity);
  });

  it("should fetch a product by id", async () => {
    const productEntity = new ProductEntity();
    productEntity.id = "product-123";
    productEntity.name = "Product 1";

    productRepository.getProduct.mockResolvedValue(productEntity);

    const result = await productService.getProduct("product-123");

    expect(productRepository.getProduct).toHaveBeenCalledWith("product-123");
    expect(result).toEqual(productEntity);
  });

  it("should update a product", async () => {
    const productDTO = { name: "Updated Product" };
    const productEntity = new ProductEntity();
    productEntity.id = "product-123";
    productEntity.name = "Updated Product";

    productRepository.updateProduct.mockResolvedValue(productEntity);

    const result = await productService.updateProduct(
      "product-123",
      productDTO
    );

    expect(productRepository.updateProduct).toHaveBeenCalledWith(
      "product-123",
      productDTO
    );
    expect(result).toEqual(productEntity);
  });

  it("should delete a product", async () => {
    const productEntity = new ProductEntity();
    productEntity.id = "product-123";

    productRepository.getProduct.mockResolvedValue(productEntity);
    productRepository.deleteProduct.mockResolvedValue(true);

    const result = await productService.deleteProduct("product-123");

    expect(productRepository.deleteProduct).toHaveBeenCalledWith("product-123");
    expect(result).toEqual(productEntity);
  });
});
