import {
  ValidationComposite,
  ValidationBuilder as Builder,
} from "@/validation/validators";
import { makeLoginValidation } from "./login-validation-factory";

describe("LoginValidationFactory", () => {
  test("Should compose ValidationComposite with correct validations", () => {
    const composite = makeLoginValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...Builder.field("email").required().email().build(),
        ...Builder.field("password").required().minLength(5).build(),
      ])
    );
  });
});
