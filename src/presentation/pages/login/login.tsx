import React, { useEffect, useState } from "react";
import Styles from "./styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";
import { Validation } from "@/presentation/protocols/validation";
import { Authentication } from "@/domain/usecases";

type State = {
  isLoading: boolean;
  errorMessage: string;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
};

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    errorMessage: "",
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      passwordError: validation.validate("password", state.password),
    });
  }, [state.email, state.password]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (state.isLoading || state.emailError || state.passwordError) return;
    setState({
      ...state,
      isLoading: true,
    });
    await authentication.auth({ email: state.email, password: state.password });
  };

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          onSubmit={handleSubmit}
          data-testid="form"
        >
          <h2>Login</h2>
          <Input
            type="email"
            name="email"
            placeholder="Insira seu email"
            error={state.emailError}
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            error={state.passwordError}
          />
          <button
            className={Styles.submit}
            type="submit"
            data-testid="submit-button"
            disabled={!!state.emailError || !!state.passwordError}
          >
            Entrar
          </button>
          <span className={Styles.signUpLink}>
            Não tem uma conta? Cadastre-se
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Login;
