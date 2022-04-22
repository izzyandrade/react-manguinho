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

type State = {
  isLoading: boolean;
  errorMessage: string;
  email: string;
  password: string;
  emailStatus: string;
  emailError: string;
  passwordError: string;
  passwordStatus: string;
};

type Props = {
  validation: Validation;
};

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    errorMessage: "",
    email: "",
    password: "",
    emailStatus: "🔴",
    emailError: "",
    passwordError: "",
    passwordStatus: "🔴",
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      passwordError: validation.validate("password", state.password),
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input
            type="email"
            name="email"
            placeholder="Insira seu email"
            status={state.emailStatus}
            errorMessage={state.emailError}
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            status={state.passwordStatus}
            errorMessage={state.passwordError}
          />
          <button
            className={Styles.submit}
            type="submit"
            data-testid="submit-button"
            disabled={true}
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
