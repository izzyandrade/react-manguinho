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
    passwordStatus: "🔴",
  });

  useEffect(() => {
    validation.validate({ email: state.email });
  }, [state.email]);

  useEffect(() => {
    validation.validate({ password: state.password });
  }, [state.password]);

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
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            status={state.passwordStatus}
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
