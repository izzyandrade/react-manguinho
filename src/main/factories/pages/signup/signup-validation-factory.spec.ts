import {
  ValidationComposite,
  ValidationBuilder as Builder,
} from "@/validation/validators";
import { makeSignUpValidation } from "./signup-validation-factory";

describe("SignUpValidationFactory", () => {
  test("Should compose ValidationComposite with correct validations", () => {
    const composite = makeSignUpValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...Builder.field("email").required().email().build(),
        ...Builder.field("name").required().minLength(5).build(),
        ...Builder.field("passwordConfirmation")
          .required()
          .minLength(5)
          .build(),
        ...Builder.field("password").required().minLength(5).build(),
      ])
    );
  });
});
