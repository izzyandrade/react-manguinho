import React from "react";
import SignUp from "./signup";
import {
  RenderResult,
  render,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Helper, ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

type SutParams = {
  errorMessage?: string;
};

const makeSut = ({ errorMessage }: SutParams = {}): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = errorMessage || null;
  const sut = render(<SignUp validation={validationStub} />);
  return {
    sut,
    validationStub,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  emailValue = faker.internet.email(),
  passwordValue = faker.internet.password(),
  nameValue = faker.name.firstName(),
  passwordConfirmationValue = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "email", emailValue);
  Helper.populateField(sut, "password", nameValue);
  Helper.populateField(sut, "password", passwordValue);
  Helper.populateField(sut, "password", passwordConfirmationValue);
  const form = sut.getByTestId("form");
  fireEvent.submit(form);
  await waitFor(() => form);
};

describe("SignUp Component", () => {
  afterEach(cleanup);
  test("Should start with initial state", () => {
    const errorMessage = "Campo obrigatório!";
    const { sut } = makeSut({ errorMessage });
    Helper.testChildCount(sut, "error-wrap", 0);
    Helper.testButtonIsDisabled(sut, "submit-button", true);
    Helper.validateInputStatus(sut, "email", errorMessage);
    Helper.validateInputStatus(sut, "name", errorMessage);
    Helper.validateInputStatus(sut, "password", errorMessage);
    Helper.validateInputStatus(sut, "passwordConfirmation", errorMessage);
  });

  test("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.populateField(sut, "email");
    Helper.validateInputStatus(sut, "email", validationStub.errorMessage);
  });

  test("Should show name error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.populateField(sut, "name");
    Helper.validateInputStatus(sut, "name", validationStub.errorMessage);
  });

  test("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.populateField(sut, "password");
    Helper.validateInputStatus(sut, "password", validationStub.errorMessage);
  });

  test("Should show passwordConfirmation error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.populateField(sut, "passwordConfirmation");
    Helper.validateInputStatus(
      sut,
      "passwordConfirmation",
      validationStub.errorMessage
    );
  });

  test("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "email");
    Helper.validateInputStatus(sut, "email");
  });

  test("Should show valid name state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "name");
    Helper.validateInputStatus(sut, "name");
  });

  test("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "password");
    Helper.validateInputStatus(sut, "password");
  });

  test("Should show valid passwordConfirmation state if validation succeeds", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "passwordConfirmation");
    Helper.validateInputStatus(sut, "passwordConfirmation");
  });

  test("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();
    Helper.populateField(sut, "email");
    Helper.populateField(sut, "name");
    Helper.populateField(sut, "password");
    Helper.populateField(sut, "passwordConfirmation");
    Helper.testButtonIsDisabled(sut, "submit-button", false);
  });

  test("Should show spinner on submit loading", async () => {
    const { sut } = makeSut();
    await simulateValidSubmit(sut);
    Helper.testElementExists(sut, "spinner");
  });
});
