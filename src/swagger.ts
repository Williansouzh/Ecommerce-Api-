import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API E-commerce",
      version: "1.0.0",
      description: "Documentação da API E-commerce",
    },
    servers: [
      {
        url: "http://localhost:3300/api-ecommerce",
      },
    ],
  },
  apis: ["./src/adapters/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
