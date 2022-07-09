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
import { AddAccount } from "@/domain/usecases";

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
  addAccount: AddAccount;
};

const SignUp: React.FC<SignUpProps> = ({ validation, addAccount }) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    errorMessage: "",
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
    emailError: "",
    nameError: "",
    passwordError: "",
    passwordConfirmationError: "",
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      nameError: validation.validate("name", state.name),
      passwordError: validation.validate("password", state.password),
      passwordConfirmationError: validation.validate(
        "passwordConfirmation",
        state.password
      ),
    });
  }, [state.email, state.password, state.name, state.passwordConfirmation]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (
        state.isLoading ||
        state.emailError ||
        state.nameError ||
        state.passwordError ||
        state.passwordConfirmationError
      )
        return;
      setState({
        ...state,
        isLoading: true,
      });
      await addAccount.add({
        email: state.email,
        name: state.name,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
    } catch (err) {
      setState({ ...state, errorMessage: err.message, isLoading: false });
    }
  };

  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          data-testid="form"
          onSubmit={handleSubmit}
        >
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
            disabled={
              !!state.emailError ||
              !!state.passwordError ||
              !!state.passwordConfirmationError ||
              !!state.nameError
            }
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
