import React, { useEffect, useState } from "react";
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";
import Styles from "./styles.scss";
import { Validation } from "@/presentation/protocols/validation";

type State = {
  isLoading: boolean;
  errorMessage: string;
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  emailError: string;
  nameError: string;
  passwordError: string;
  passwordConfirmationError: string;
};

type SignUpProps = {
  validation: Validation;
};

const SignUp: React.FC<SignUpProps> = ({ validation }) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    errorMessage: "",
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
    emailError: "",
    nameError: "",
    passwordError: "Campo obrigatório!",
    passwordConfirmationError: "Campo obrigatório!",
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      nameError: validation.validate("name", state.name),
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form} data-testid="form">
          <h2>Cadastre-se</h2>
          <Input
            type="email"
            name="email"
            placeholder="Insira seu email"
            error={state.emailError}
          />
          <Input
            type="text"
            name="name"
            placeholder="Insira seu nome"
            error={state.nameError}
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            error={state.passwordError}
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirme sua senha"
            error={state.passwordConfirmationError}
          />
          <button
            className={Styles.submit}
            type="submit"
            data-testid="submit-button"
            disabled
          >
            Cadastrar
          </button>
          <span className={Styles.loginLink} data-testid="login-link">
            Já tem uma conta? Clique para entrar
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
