import React from "react";
import Login from "./login";
import { BrowserRouter } from "react-router-dom";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import "jest-localstorage-mock";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import faker from "@faker-js/faker";
import { InvalidCredentialsError } from "@/domain/error";

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
    <BrowserRouter>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </BrowserRouter>
  );
  return {
    sut,
    validationStub,
    authenticationSpy,
  };
};

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUseNavigate,
}));

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
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
  });
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

  test("Should call Authentication only once when submiting", () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", () => {
    const { sut, authenticationSpy } = makeSut({
      errorMessage: faker.random.words(),
    });
    populateEmailField(sut);
    const form = sut.getByTestId("form");
    fireEvent.submit(form);
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if authentication fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, "auth")
      .mockReturnValueOnce(Promise.reject(error));
    simulateValidSubmit(sut);
    const errorWrap = sut.getByTestId("error-wrap");
    await waitFor(() => errorWrap);
    const mainError = sut.getByTestId("main-error");
    expect(mainError.textContent).toBe(error.message);
    expect(errorWrap.childElementCount).toBe(1);
  });

  test("Should add accessToken to localStorage and naviagte to homepage on auth success", async () => {
    const { sut, authenticationSpy } = makeSut();
    simulateValidSubmit(sut);
    await waitFor(() => sut.getByTestId("form"));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "token",
      authenticationSpy.account.token
    );
    expect(mockedUseNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("Should go to signup page on clicking the link", () => {
    const { sut } = makeSut();
    const signUpLink = sut.getByTestId("signup-link");
    fireEvent.click(signUpLink);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/signup");
  });
});
