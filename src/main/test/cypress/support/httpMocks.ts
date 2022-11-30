import faker from "@faker-js/faker";

export const mockInvalidCredentialsError = (url: RegExp): void => {
  cy.intercept(
    { method: "POST", url },
    {
      statusCode: 401,
      body: {
        error: "401: Invalid Credentials",
      },
    }
  ).as("request");
};

export const mockSuccessResponse = (
  method: string,
  url: RegExp,
  response: any
) => {
  cy.intercept(
    { method, url },
    {
      statusCode: 200,
      body: response,
    }
  ).as("request");
};
