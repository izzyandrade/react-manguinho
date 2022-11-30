import faker from "@faker-js/faker";
import { fireEvent, RenderResult } from "@testing-library/react";

export const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const fieldToBeTested = sut.getByTestId(fieldName);
  expect(fieldToBeTested.textContent).toBe(text);
};

export const testChildCount = (
  sut: RenderResult,
  field: string,
  expectedCount: number
): void => {
  const fieldById = sut.getByTestId(field);
  expect(fieldById.childElementCount).toBe(expectedCount);
};

export const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const validateInputStatus = (
  sut: RenderResult,
  inputField: string,
  validationError: string = ""
): void => {
  const inputWrap = sut.getByTestId(`${inputField}-wrap`);
  const inputLabel = sut.getByTestId(`${inputField}-label`);
  const inputElement = sut.getByTestId(`${inputField}`);
  expect(inputWrap.getAttribute("data-status")).toBe(
    validationError ? "invalid" : "valid"
  );
  expect(inputLabel.title).toBe(validationError);
  expect(inputElement.title).toBe(validationError);
};

export const populateField = (
  sut: RenderResult,
  fieldName: string,
  value = faker.random.word()
): void => {
  const field = sut.getByTestId(fieldName) as HTMLInputElement;
  fireEvent.input(field, { target: { value } });
};

export const testElementExists = (
  sut: RenderResult,
  fieldName: string
): void => {
  const fieldToCheck = sut.getByTestId(fieldName);
  expect(fieldToCheck).toBeTruthy();
};
