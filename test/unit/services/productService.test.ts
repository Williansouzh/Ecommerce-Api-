import "reflect-metadata";
import { CreateProductDTO } from "@src/application/dtos/productDTO";
import { App } from "@src/server";
import supertest from "supertest";

let server: App;

beforeAll(async () => {
  server = new App();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());

describe("Product Controller - Functional Tests", () => {
  const url = "/api-ecommerce/products";

  const createProduct = async (productData?: Partial<CreateProductDTO>) => {
    const defaultProductData = {
      name: "Test Product",
      price: 100,
      description: "This is a test product",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const response = await global.testRequest
      .post(`${url}`)
      .send({ ...defaultProductData, ...productData })
      .expect(201);

    return response.body;
  };

  it("should create a product successfully", async () => {
    const productData = {
      name: "Custom Product",
      price: 200,
    };

    const response = await createProduct(productData);

    expect(response).toEqual(
      expect.objectContaining({
        message: "Product created successfully",
        productId: expect.any(String),
      })
    );
  });

  it("should retrieve a product by id", async () => {
    const createdProduct = await createProduct();

    const getResponse = await global.testRequest
      .get(`${url}/${createdProduct.productId}`)
      .expect(200);

    expect(getResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    );
  });

  it("should update a product", async () => {
    const createdProduct = await createProduct();

    const updatedData = {
      name: "Updated Product",
      price: 150,
    };

    const updateResponse = await global.testRequest
      .put(`${url}/${createdProduct.productId}`)
      .send(updatedData)
      .expect(200);

    expect(updateResponse.body).toEqual({
      message: "Product updated successfully",
    });
  });

  it("should delete a product", async () => {
    const createdProduct = await createProduct();

    await global.testRequest
      .delete(`${url}/${createdProduct.productId}`)
      .expect(200);
  });
});
