import { AccountModel } from "@/domain/models";
import faker from "@faker-js/faker";

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
});
