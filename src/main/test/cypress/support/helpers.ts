const baseUrl: string = Cypress.config().baseUrl;

export const testInputStatus = (field: string, error?: string): void => {
  cy.getByTestId(`${field}-wrap`).should(
    "have.attr",
    "data-status",
    error ? "invalid" : "valid"
  );
  const attr = error ? "" : "not.";
  cy.getByTestId(field).should(`${attr}have.attr`, "title", error);
  cy.getByTestId(`${field}-label`).should(`${attr}have.attr`, "title", error);
};

export const testWindowUrl = (url: string): void => {
  cy.url().should("eq", `${baseUrl + url}`);
};

export const testLocalStorageItem = (key: string): void => {
  cy.window().then((window) => assert.isOk(window.localStorage.getItem(key)));
};
