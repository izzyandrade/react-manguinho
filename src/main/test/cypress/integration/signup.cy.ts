import { faker } from "@faker-js/faker";
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

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("email").type(faker.random.word());
    cy.getByTestId("name").type(faker.random.alphaNumeric(3));
    cy.getByTestId("password").type(faker.random.alphaNumeric(3));
    cy.getByTestId("passwordConfirmation").type(faker.random.alphaNumeric(3));
    testInputStatus("email", "Campo inválido");
    testInputStatus("name", "Campo inválido");
    testInputStatus("password", "Campo inválido");
    testInputStatus("passwordConfirmation", "Campo inválido");
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });
});
