import React from "react";
import { Login } from "@/presentation/pages";
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

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const fieldToCheck = sut.getByTestId(fieldName);
  expect(fieldToCheck).toBeTruthy();
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const fieldToBeTested = sut.getByTestId(fieldName);
  expect(fieldToBeTested.textContent).toBe(text);
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
  testElementText(sut, `${inputField}-status`, validationError ? "🔴" : "🟢");
};

const simulateValidSubmit = async (
  sut: RenderResult,
  emailValue = faker.internet.email(),
  passwordValue = faker.internet.password()
): Promise<void> => {
  populateEmailField(sut, emailValue);
  populatePasswordField(sut, passwordValue);
  const form = sut.getByTestId("form");
  fireEvent.submit(form);
  await waitFor(() => form);
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
    testButtonIsDisabled(sut, "submit-button", true);
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
    testButtonIsDisabled(sut, "submit-button", false);
  });

  test("Should show spinner on authentication loading", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);
    testElementExists(sut, "spinner");
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();
    const emailValue = faker.internet.email();
    const passwordValue = faker.internet.password();
    await simulateValidSubmit(sut, emailValue, passwordValue);
    expect(authenticationSpy.params).toEqual({
      email: emailValue,
      password: passwordValue,
    });
  });

  test("Should call Authentication only once when submiting", async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", async () => {
    const { sut, authenticationSpy } = makeSut({
      errorMessage: faker.random.words(),
    });
    await simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should present error if authentication fails", async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest
      .spyOn(authenticationSpy, "auth")
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);
    const errorWrap = sut.getByTestId("error-wrap");
    testElementText(sut, "main-error", error.message);
    expect(errorWrap.childElementCount).toBe(1);
  });

  test("Should add accessToken to localStorage and naviagte to homepage on auth success", async () => {
    const { sut, authenticationSpy } = makeSut();
    await simulateValidSubmit(sut);
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
