import { faker } from "@faker-js/faker";
import {
  testInputStatus,
  testLocalStorageItem,
  testWindowUrl,
} from "../support/helpers";
import {
  mockEmailInUseError,
  mockSuccessSignUpResponse,
} from "./mocks/signup-mocks";

const simulateValidInputs = () => {
  const password = faker.random.alphaNumeric(5);
  cy.getByTestId("email").type(faker.internet.email());
  cy.getByTestId("name").type(faker.random.words(2));
  cy.getByTestId("password").type(password);
  cy.getByTestId("passwordConfirmation").type(password);
};

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

  it("Should present valid state if form is valid", () => {
    simulateValidInputs();
    testInputStatus("email");
    testInputStatus("name");
    testInputStatus("password");
    testInputStatus("passwordConfirmation");
    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("should present EmailInUseError if duplicate email is provided", () => {
    mockEmailInUseError();
    simulateValidInputs();
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should(
      "contain.text",
      "O email já está sendo utilizado"
    );
    testWindowUrl("/signup");
  });

  it("Should save access token and navigate if valid credentials are provided", () => {
    mockSuccessSignUpResponse();
    simulateValidInputs();
    cy.getByTestId("submit-button").click();
    cy.getByTestId("error-wrap").should("not.exist");
    testWindowUrl("/");
    testLocalStorageItem("accessToken");
  });

  it("should prevent multiple submits", () => {
    mockSuccessSignUpResponse();
    simulateValidInputs();
    cy.getByTestId("submit-button").dblclick();
    cy.get("@request.all").should("have.length", 1);
  });
});
