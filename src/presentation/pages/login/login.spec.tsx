import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import Login from "./login";
import { ValidationSpy } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = render(<Login validation={validationSpy} />);
  return {
    sut,
    validationSpy,
  };
};

describe("Login Component", () => {
  afterEach(cleanup);
  test("Should start with initial state", () => {
    const { sut } = makeSut();
    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = sut.getByTestId("submit-button") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = sut.getByTestId("email-status") as HTMLSpanElement;
    const passwordStatus = sut.getByTestId(
      "password-status"
    ) as HTMLSpanElement;
    expect(emailStatus.textContent).toBe("🔴");
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should call validation method with correct email", () => {
    const { sut, validationSpy } = makeSut();
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    const fakeEmail = faker.internet.email();
    fireEvent.input(emailInput, { target: { value: fakeEmail } });
    expect(validationSpy.fieldName).toBe("email");
    expect(validationSpy.fieldValue).toBe(fakeEmail);
  });

  test("Should call validation method with correct password", () => {
    const { sut, validationSpy } = makeSut();
    const passwordInput = sut.getByTestId("password") as HTMLInputElement;
    const fakePassword = faker.internet.password();
    fireEvent.input(passwordInput, { target: { value: fakePassword } });
    expect(validationSpy.fieldName).toBe("password");
    expect(validationSpy.fieldValue).toBe(fakePassword);
  });
});
