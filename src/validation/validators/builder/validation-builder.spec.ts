import {
  RequiredFieldValidation,
  EmailValidation,
} from "@/validation/validators";
import { MinLengthValidation } from "../min-length/min-length-validation";
import { ValidationBuilder as sut } from "./validation-builder";
import faker from "@faker-js/faker";

describe("ValidationBuilder", () => {
  test("Should return required field validation when asked", () => {
    const fieldName = faker.database.column();
    const validations = sut.field(fieldName).required().build();
    expect(validations).toEqual([new RequiredFieldValidation(fieldName)]);
  });

  test("Should return email validation when asked", () => {
    const fieldName = faker.database.column();
    const validations = sut.field(fieldName).email().build();
    expect(validations).toEqual([new EmailValidation(fieldName)]);
  });

  test("Should return minLength validation when asked", () => {
    const fieldName = faker.database.column();
    const length = faker.datatype.number();
    const validations = sut.field(fieldName).minLength(length).build();
    expect(validations).toEqual([new MinLengthValidation(fieldName, length)]);
  });

  test("Should return a list of validations when asked", () => {
    const fieldName = faker.database.column();
    const length = faker.datatype.number();
    const validations = sut
      .field(fieldName)
      .required()
      .email()
      .minLength(length)
      .build();
    expect(validations).toEqual([
      new RequiredFieldValidation(fieldName),
      new EmailValidation(fieldName),
      new MinLengthValidation(fieldName, length),
    ]);
  });
});
