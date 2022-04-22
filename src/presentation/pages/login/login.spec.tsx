import React from "react";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import Login from "./login";
import { ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";
import { Authentication, AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "@/domain/models";
import { mockAccountModel } from "@/domain/test";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  errorMessage?: string;
};

class AuthenticationSpy implements Authentication {
  account = mockAccountModel();
  params: AuthenticationParams;
  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params;
    return Promise.resolve(this.account);
  }
}

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

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = sut.getByTestId("email-status") as HTMLSpanElement;
    const passwordStatus = sut.getByTestId(
      "password-status"
    ) as HTMLSpanElement;
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId("email-status") as HTMLSpanElement;
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });

  test("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = sut.getByTestId(
      "password-status"
    ) as HTMLSpanElement;
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId("email-status") as HTMLSpanElement;
    expect(emailStatus.title).toBe("Tudo certo!");
    expect(emailStatus.textContent).toBe("🟢");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = sut.getByTestId(
      "password-status"
    ) as HTMLSpanElement;
    expect(passwordStatus.title).toBe("Tudo certo!");
    expect(passwordStatus.textContent).toBe("🟢");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on authentication loading", () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);
    const spinner = sut.getByTestId("spinner") as HTMLDivElement;
    expect(spinner).toBeTruthy();
  });

  test("Should call Authentication with correct values", () => {
    const { sut, authenticationSpy } = makeSut();
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    const emailValue = faker.internet.email();
    const passwordValue = faker.internet.password();
    fireEvent.input(passwordInput, {
      target: { value: passwordValue },
    });
    fireEvent.input(emailInput, {
      target: { value: emailValue },
    });
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    fireEvent.click(submitButton);
    expect(authenticationSpy.params).toEqual({
      email: emailValue,
      password: passwordValue,
    });
  });
});
