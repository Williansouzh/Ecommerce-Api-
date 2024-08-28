import { App } from "../src/server";
import supertest from "supertest";

let server: App;
beforeAll(async () => {
  server = new App();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());
