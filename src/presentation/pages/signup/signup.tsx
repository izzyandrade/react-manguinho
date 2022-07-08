import React from "react";
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";
import { useNavigate } from "react-router-dom";
import Styles from "./styles.scss";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <FormContext.Provider value={{ state: {} }}>
        <form className={Styles.form} data-testid="form">
          <h2>Cadastre-se</h2>
          <Input type="email" name="email" placeholder="Insira seu email" />
          <Input type="text" name="name" placeholder="Insira seu nome" />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
          />
          <Input
            type="password"
            name="password"
            placeholder="Confirme sua senha"
          />
          <button
            className={Styles.submit}
            type="submit"
            data-testid="submit-button"
          >
            Cadastrar
          </button>
          <span
            onClick={() => {
              navigate("/login");
            }}
            className={Styles.loginLink}
            data-testid="login-link"
          >
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
