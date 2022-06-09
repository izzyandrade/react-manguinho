import {
  RequiredFieldValidation,
  EmailValidation,
} from "@/validation/validators";
import { ValidationBuilder as sut } from "./validation-builder";

describe("ValidationBuilder", () => {
  test("Should return required field validation when asked", () => {
    const validations = sut.field("any_field").required().build();
    expect(validations).toEqual([new RequiredFieldValidation("any_field")]);
  });

  test("Should return email validation when asked", () => {
    const validations = sut.field("any_field").email().build();
    expect(validations).toEqual([new EmailValidation("any_field")]);
  });
});
