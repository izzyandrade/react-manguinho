import faker from "@faker-js/faker";
import * as Helper from "../../support/httpMocks";

export const mockEmailInUseError = () => Helper.mockEmailInUseError(/signup/);
export const mockSuccessSignUpResponse = () =>
  Helper.mockSuccessResponse("POST", /signup/, {
    accessToken: faker.datatype.uuid(),
  });
