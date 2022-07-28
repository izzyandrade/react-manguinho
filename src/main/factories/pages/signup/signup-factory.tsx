import React from "react";
import { SignUp } from "@/presentation/pages";
import { makeSignUpValidation } from "./signup-validation-factory";
import {
  makeRemoteAddAccount,
  makeLocalSaveAccessToken,
} from "@/main/factories/usecases";

export const makeSignUp: React.FC = () => {
  return (
    <SignUp
      validation={makeSignUpValidation()}
      addAccount={makeRemoteAddAccount()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  );
};
