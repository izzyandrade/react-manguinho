import React from "react";
import Login from "./login";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  errorMessage?: string;
};

const makeSut = ({ errorMessage }: SutParams = {}): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = errorMessage || null;
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  );
  return {
    sut,
    validationStub,
    authenticationSpy,
  };
};

const populateEmailField = (
  sut: RenderResult,
  emailValue = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId("email") as HTMLInputElement;
  fireEvent.input(emailInput, { target: { value: emailValue } });
};

const populatePasswordField = (
  sut: RenderResult,
  passwordValue = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId("password") as HTMLInputElement;
  fireEvent.input(passwordInput, { target: { value: passwordValue } });
};

const validateInputStatus = (
  sut: RenderResult,
  inputField: string,
  validationError?: string
): void => {
  const inputElement = sut.getByTestId(`${inputField}-status`);
  expect(inputElement.title).toBe(validationError || "Tudo certo!");
  expect(inputElement.textContent).toBe(validationError ? "🔴" : "🟢");
};

const simulateValidSubmit = (
  sut: RenderResult,
  emailValue = faker.internet.email(),
  passwordValue = faker.internet.password()
): void => {
  populateEmailField(sut, emailValue);
  populatePasswordField(sut, passwordValue);
  const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
  fireEvent.click(submitButton);
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    validateInputStatus(sut, "email", validationStub.errorMessage);
    validateInputStatus(sut, "password", validationStub.errorMessage);
  });

  test("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    populateEmailField(sut);
    validateInputStatus(sut, "email", validationStub.errorMessage);
  });

  test("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    populatePasswordField(sut);
    validateInputStatus(sut, "password", validationStub.errorMessage);
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    validateInputStatus(sut, "email");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    validateInputStatus(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    populatePasswordField(sut);
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on authentication loading", () => {
    const { sut } = makeSut();
    simulateValidSubmit(sut);
    const spinner = sut.getByTestId("spinner") as HTMLDivElement;
    expect(spinner).toBeTruthy();
  });

  test("Should call Authentication with correct values", () => {
    const { sut, authenticationSpy } = makeSut();
    const emailValue = faker.internet.email();
    const passwordValue = faker.internet.password();
    simulateValidSubmit(sut, emailValue, passwordValue);
    expect(authenticationSpy.params).toEqual({
      email: emailValue,
      password: passwordValue,
    });
  });
});
