import React from "react";
import SignUp from "./signup";
import { RenderResult, render } from "@testing-library/react";
import { Helper } from "@/presentation/test";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return {
    sut,
  };
};

describe("SignUp Component", () => {
  test("Should start with initial state", () => {
    const { sut } = makeSut();
    const validationError = "Campo obrigatório!";
    Helper.testChildCount(sut, "error-wrap", 0);
    Helper.testButtonIsDisabled(sut, "submit-button", true);
    Helper.validateInputStatus(sut, "email", validationError);
    Helper.validateInputStatus(sut, "name", validationError);
    Helper.validateInputStatus(sut, "password", validationError);
    Helper.validateInputStatus(sut, "passwordConfirmation", validationError);
  });
});
