import React from "react";
import { Login } from "@/presentation/pages";
import { BrowserRouter } from "react-router-dom";
import {
  ValidationStub,
  AuthenticationSpy,
  SaveAccessTokenMock,
  Helper,
} from "@/presentation/test";
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
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  errorMessage?: string;
};

const makeSut = ({ errorMessage }: SutParams = {}): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  validationStub.errorMessage = errorMessage || null;
  const sut = render(
    <BrowserRouter>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </BrowserRouter>
  );
  return {
    sut,
    validationStub,
    authenticationSpy,
    saveAccessTokenMock,
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
  test("Should start with initial state", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.testChildCount(sut, "error-wrap", 0);
    Helper.testButtonIsDisabled(sut, "submit-button", true);
    Helper.validateInputStatus(sut, "email", validationStub.errorMessage);
    Helper.validateInputStatus(sut, "password", validationStub.errorMessage);
  });

  test("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    populateEmailField(sut);
    Helper.validateInputStatus(sut, "email", validationStub.errorMessage);
  });

  test("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    populatePasswordField(sut);
    Helper.validateInputStatus(sut, "password", validationStub.errorMessage);
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    Helper.validateInputStatus(sut, "email");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    populatePasswordField(sut);
    Helper.validateInputStatus(sut, "password");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    populateEmailField(sut);
    populatePasswordField(sut);
    Helper.testButtonIsDisabled(sut, "submit-button", false);
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
    Helper.testElementText(sut, "main-error", error.message);
    expect(errorWrap.childElementCount).toBe(1);
  });

  test("Should call SaveAccessToken and navigate to homepage on auth success", async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();
    await simulateValidSubmit(sut);
    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
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
