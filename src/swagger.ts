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
      {
        url: "http://ec2-3-81-10-188.compute-1.amazonaws.com:3000/",
      },
    ],
  },
  apis: ["./src/adapters/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
