import { InvalidFieldError } from "@/validation/errors";
import { MinLengthValidation } from "./min-length-validation";
import faker from "@faker-js/faker";

const makeSut = (field: string): MinLengthValidation => {
  return new MinLengthValidation(field, 5);
};

describe("MinLength Validation", () => {
  test("should return error if value is invalid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.alphaNumeric(4) });
    expect(error).toEqual(new InvalidFieldError());
  });

  test("should return falsy if value is valid", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.alphaNumeric(5) });
    expect(error).toBeFalsy();
  });
});
