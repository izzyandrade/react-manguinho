import {
  RequiredFieldValidation,
  EmailValidation,
} from "@/validation/validators";
import { MinLengthValidation } from "../min-length/min-length-validation";
import { ValidationBuilder as sut } from "./validation-builder";
import faker from "@faker-js/faker";

describe("ValidationBuilder", () => {
  test("Should return required field validation when asked", () => {
    const validations = sut.field("any_field").required().build();
    expect(validations).toEqual([new RequiredFieldValidation("any_field")]);
  });

  test("Should return email validation when asked", () => {
    const validations = sut.field("any_field").email().build();
    expect(validations).toEqual([new EmailValidation("any_field")]);
  });

  test("Should return minLength validation when asked", () => {
    const validations = sut.field("any_field").minLength(5).build();
    expect(validations).toEqual([new MinLengthValidation("any_field", 5)]);
  });

  test("Should return a list of validations when asked", () => {
    const validations = sut
      .field("any_field")
      .required()
      .email()
      .minLength(5)
      .build();
    expect(validations).toEqual([
      new RequiredFieldValidation("any_field"),
      new EmailValidation("any_field"),
      new MinLengthValidation("any_field", 5),
    ]);
  });
});
