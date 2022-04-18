import React, { useState } from "react";
import Styles from "./styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";

interface IState {
  isLoading: boolean;
  errorMessage: string;
}

const Login: React.FC = () => {
  const [state] = useState<IState>({
    isLoading: false,
    errorMessage: "",
  });
  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={state}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Insira seu email" />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
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
