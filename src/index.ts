import { App } from "./server";
(async (): Promise<void> => {
  const server = new App();
  await server.init();
  server.start();
})();
