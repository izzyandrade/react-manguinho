import React from "react";
import SignUp from "./signup";
import { RenderResult, render, cleanup } from "@testing-library/react";
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

describe("SignUp Component", () => {
  afterEach(cleanup);
  test("Should start with initial state", () => {
    const errorMessage = "Campo obrigatório!";
    const { sut } = makeSut({ errorMessage });
    Helper.testChildCount(sut, "error-wrap", 0);
    Helper.testButtonIsDisabled(sut, "submit-button", true);
    Helper.validateInputStatus(sut, "email", errorMessage);
    Helper.validateInputStatus(sut, "name", "Campo obrigatório!");
    Helper.validateInputStatus(sut, "password", "Campo obrigatório!");
    Helper.validateInputStatus(
      sut,
      "passwordConfirmation",
      "Campo obrigatório!"
    );
  });

  test("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut({
      errorMessage: faker.random.words(),
    });
    Helper.populateField(sut, "email");
    Helper.validateInputStatus(sut, "email", validationStub.errorMessage);
  });
});
