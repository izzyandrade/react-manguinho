import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import Login from "./login";
import { Validation } from "@/presentation/protocols/validation";

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

class ValidationSpy implements Validation {
  errorMessage: string;
  input: object;
  validate(input: object): string {
    this.input = input;
    return this.errorMessage;
  }
}

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
    fireEvent.input(emailInput, { target: { value: "any_email" } });
    expect(validationSpy.input).toEqual({ email: "any_email" });
  });
});
