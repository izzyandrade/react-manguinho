import faker from "@faker-js/faker";
import { HttpPostParams } from "../protocols/http";

export const mockPostRequest = (): HttpPostParams<any> => {
  return {
    url: faker.internet.url(),
    body: faker.internet.exampleEmail(),
  };
};
