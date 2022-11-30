import faker from "@faker-js/faker";
import {
  testInputStatus,
  testLocalStorageItem,
  testWindowUrl,
} from "../support/helpers";
import {
  mockInvalidCredentialsError,
  mockSuccessLoginResponse,
} from "./mocks/login-mocks";

const simulateValidInputs = () => {
  cy.getByTestId("email").type(faker.internet.email());
  cy.getByTestId("password").type(faker.random.alphaNumeric(5));
};

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should load with correct initial state", () => {
    testInputStatus("email", "Campo Obrigatório");
    testInputStatus("password", "Campo Obrigatório");
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("email").type(faker.random.word());
    cy.getByTestId("password").type(faker.random.alphaNumeric(3));
    testInputStatus("email", "Campo inválido");
    testInputStatus("password", "Campo inválido");
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    simulateValidInputs();
    testInputStatus("email");
    testInputStatus("password");
    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error if invalid credentials are provided", () => {
    mockInvalidCredentialsError();
    simulateValidInputs();
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should(
      "contain.text",
      "Credenciais inválidas"
    );
    testWindowUrl("/login");
  });

  it("Should save access token and navigate if valid credentials are provided", () => {
    mockSuccessLoginResponse();
    simulateValidInputs();
    cy.getByTestId("submit-button").click();
    cy.getByTestId("error-wrap").should("not.exist");
    testWindowUrl("/");
    testLocalStorageItem("accessToken");
  });

  it("should prevent multiple submits", () => {
    mockSuccessLoginResponse();
    simulateValidInputs();
    cy.getByTestId("submit-button").dblclick();
    cy.get("@request.all").should("have.length", 1);
  });

  it("should navigate to signup if button is clicked", () => {
    cy.getByTestId("signup-link").click();
    testWindowUrl("/signup");
  });
});
