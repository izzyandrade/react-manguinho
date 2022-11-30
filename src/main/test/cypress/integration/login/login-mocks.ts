import faker from "@faker-js/faker";
import * as Helper from "../../support/httpMocks";

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/);

export const mockSuccessLoginResponse = (): void => {
  Helper.mockSuccessResponse("POST", /login/, {
    accessToken: faker.datatype.uuid(),
  });
};
