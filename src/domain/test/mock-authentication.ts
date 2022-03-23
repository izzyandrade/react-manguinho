import { AuthenticationParams } from "@/domain/usecases/authentication";
import faker from "@faker-js/faker";
import { AccountModel } from "../models/accountModel";

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  token: faker.datatype.uuid(),
});
