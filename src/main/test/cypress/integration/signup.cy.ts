import { testInputStatus } from "../support/helpers";

describe("Signup", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("should load with correct initial state", () => {
    testInputStatus("email", "Campo Obrigatório");
    testInputStatus("name", "Campo Obrigatório");
    testInputStatus("password", "Campo Obrigatório");
    testInputStatus("passwordConfirmation", "Campo Obrigatório");
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });
});
