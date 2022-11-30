import faker from "@faker-js/faker";

const baseUrl: string = Cypress.config().baseUrl;

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should load with correct initial state", () => {
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "invalid");
    cy.getByTestId("email").should("have.attr", "title", "Campo Obrigatório");
    cy.getByTestId("email-label").should(
      "have.attr",
      "title",
      "Campo Obrigatório"
    );
    cy.getByTestId("password-wrap").should(
      "have.attr",
      "data-status",
      "invalid"
    );
    cy.getByTestId("password").should(
      "have.attr",
      "title",
      "Campo Obrigatório"
    );
    cy.getByTestId("password-label").should(
      "have.attr",
      "title",
      "Campo Obrigatório"
    );
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("email").type(faker.random.word());
    cy.getByTestId("email").should("have.attr", "title", "Campo inválido");
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "invalid");
    cy.getByTestId("email-label").should(
      "have.attr",
      "title",
      "Campo inválido"
    );
    cy.getByTestId("password").type(faker.random.alphaNumeric(3));
    cy.getByTestId("password").should("have.attr", "title", "Campo inválido");
    cy.getByTestId("password-wrap").should(
      "have.attr",
      "data-status",
      "invalid"
    );
    cy.getByTestId("password-label").should(
      "have.attr",
      "title",
      "Campo inválido"
    );
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByTestId("email").type(faker.internet.email());
    cy.getByTestId("email-wrap").should("have.attr", "data-status", "valid");
    cy.getByTestId("email").should("not.have.attr", "title");
    cy.getByTestId("password").type(faker.random.alphaNumeric(5));
    cy.getByTestId("password-wrap").should("have.attr", "data-status", "valid");
    cy.getByTestId("password").should("not.have.attr", "title");
    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error if invalid credentials are provided", () => {
    cy.intercept(
      { method: "POST", url: /login/ },
      {
        statusCode: 401,
        body: {
          error: "401: Invalid Credentials",
        },
      }
    );
    cy.getByTestId("email").type(faker.internet.email());
    cy.getByTestId("password").type(faker.random.alphaNumeric(5));
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should(
      "contain.text",
      "Credenciais inválidas"
    );
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("Should save access token and navigate if valid credentials are provided", () => {
    cy.intercept(
      { method: "POST", url: /login/ },
      {
        statusCode: 200,
        body: {
          accessToken: faker.datatype.uuid(),
        },
      }
    );
    cy.getByTestId("email").type(faker.internet.email());
    cy.getByTestId("password").type(faker.random.alphaNumeric(5));
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should("not.exist");
    cy.url().should("eq", `${baseUrl}/`);
    cy.window().then((window) =>
      assert.isOk(window.localStorage.getItem("accessToken"))
    );
  });

  it("should prevent multiple submits", () => {
    cy.intercept(
      { method: "POST", url: /login/ },
      {
        statusCode: 200,
        body: {
          accessToken: faker.datatype.uuid(),
        },
      }
    ).as("loginRequest");
    cy.getByTestId("email").type(faker.internet.email());
    cy.getByTestId("password").type(faker.random.alphaNumeric(5));
    cy.getByTestId("submit-button").dblclick();
    cy.get("@loginRequest.all").should("have.length", 1);
  });

  it("should navigate to signup if button is clicked", () => {
    cy.getByTestId("signup-link").click();
    cy.url().should("eq", `${baseUrl}/signup`);
  });
});
