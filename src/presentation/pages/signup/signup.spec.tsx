import React from "react";
import SignUp from "./signup";
import {
  RenderResult,
  render,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Helper, ValidationStub, AddAccountSpy } from "@/presentation/test";
import faker from "@faker-js/faker";
import { EmailInUseError } from "@/domain/error";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
  addAccountSpy: AddAccountSpy;
};

type SutParams = {
  errorMessage?: string;
};

const makeSut = ({ errorMessage }: SutParams = {}): SutTypes => {
  const validationStub = new ValidationStub();
  const addAccountSpy = new AddAccountSpy();
  validationStub.errorMessage = errorMessage || null;
  const sut = render(
    <SignUp validation={validationStub} addAccount={addAccountSpy} />
  );
  return {
    sut,
    validationStub,
    addAccountSpy,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  emailValue = faker.internet.email(),
  nameValue = faker.name.firstName(),
  passwordValue = faker.internet.password(),
  passwordConfirmationValue = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "email", emailValue);
  Helper.populateField(sut, "name", nameValue);
  Helper.populateField(sut, "password", passwordValue);
  Helper.populateField(sut, "passwordConfirmation", passwordConfirmationValue);
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

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountSpy } = makeSut();
    const nameValue = faker.name.findName();
    const emailValue = faker.internet.email();
    const passwordValue = faker.internet.password();
    await simulateValidSubmit(
      sut,
      emailValue,
      nameValue,
      passwordValue,
      passwordValue
    );
    expect(addAccountSpy.params).toEqual({
      email: emailValue,
      name: nameValue,
      password: passwordValue,
      passwordConfirmation: passwordValue,
    });
  });

  test("Should call AddAccount only once when submiting", async () => {
    const { sut, addAccountSpy } = makeSut();
    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);
    expect(addAccountSpy.callsCount).toBe(1);
  });

  test("Should not call AddAccount if form is invalid", async () => {
    const { sut, addAccountSpy } = makeSut({
      errorMessage: faker.random.words(),
    });
    await simulateValidSubmit(sut);
    expect(addAccountSpy.callsCount).toBe(0);
  });

  test("Should present error if AddAccount fails", async () => {
    const { sut, addAccountSpy } = makeSut();
    const error = new EmailInUseError();
    jest.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);
    const errorWrap = sut.getByTestId("error-wrap");
    Helper.testElementText(sut, "main-error", error.message);
    expect(errorWrap.childElementCount).toBe(1);
  });
});
