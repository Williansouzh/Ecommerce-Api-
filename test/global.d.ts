import { Test } from "supertest";
import TestAgent from "supertest/lib/agent";

declare global {
  //eslint-disable-next-line no-var
  var testRequest: TestAgent<Test>;
  var testUserToken: string;
}

export {};
