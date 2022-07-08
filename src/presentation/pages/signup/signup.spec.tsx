import React from "react";
import SignUp from "./signup";
import { RenderResult, render } from "@testing-library/react";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return {
    sut,
  };
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const fieldToBeTested = sut.getByTestId(fieldName);
  expect(fieldToBeTested.textContent).toBe(text);
};

const testChildCount = (
  sut: RenderResult,
  field: string,
  expectedCount: number
): void => {
  const fieldById = sut.getByTestId(field);
  expect(fieldById.childElementCount).toBe(expectedCount);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
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

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const { sut } = makeSut();
    const validationError = "Campo obrigatório!";
    testChildCount(sut, "error-wrap", 0);
    testButtonIsDisabled(sut, "submit-button", true);
    validateInputStatus(sut, "email", validationError);
    validateInputStatus(sut, "name", validationError);
    validateInputStatus(sut, "password", validationError);
    validateInputStatus(sut, "passwordConfirmation", validationError);
  });
});
