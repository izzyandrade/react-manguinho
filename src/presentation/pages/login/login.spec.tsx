import React from "react";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import Login from "./login";
import { ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (errorMessage?: string): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = errorMessage || null;
  const sut = render(<Login validation={validationStub} />);
  return {
    sut,
    validationStub,
  };
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const { sut, validationStub } = makeSut(faker.random.words());
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
    const { sut, validationStub } = makeSut(faker.random.words());
    const emailInput = sut.getByTestId("email") as HTMLInputElement;
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId("email-status") as HTMLSpanElement;
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });

  test("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut(faker.random.words());
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
});
