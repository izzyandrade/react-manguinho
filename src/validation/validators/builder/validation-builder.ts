import { FieldValidation } from "@/validation/protocols/field-validation";
import {
  MinLengthValidation,
  RequiredFieldValidation,
} from "@/validation/validators";
import { EmailValidation } from "../email/email-validation";

export class ValidationBuilder {
  constructor(
    private readonly fieldName: string,
    private readonly validations: FieldValidation[]
  ) {}

  static field(fieldName: string): ValidationBuilder {
    return new ValidationBuilder(fieldName, []);
  }

  required(): ValidationBuilder {
    this.validations.push(new RequiredFieldValidation(this.fieldName));
    return this;
  }

  email(): ValidationBuilder {
    this.validations.push(new EmailValidation(this.fieldName));
    return this;
  }

  minLength(length: number): ValidationBuilder {
    this.validations.push(new MinLengthValidation(this.fieldName, length));
    return this;
  }

  build(): FieldValidation[] {
    return this.validations;
  }
}
