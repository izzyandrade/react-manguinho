import React from "react";
import Styles from "./styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
} from "@/presentation/components";

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader />
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Insira seu email" />
        <Input type="password" name="password" placeholder="Insira sua senha" />
        <button type="submit">Entrar</button>
        <span className={Styles.signUpLink}>
          Não tem uma conta? Cadastre-se
        </span>
        <FormStatus />
      </form>
      <Footer />
    </div>
  );
};

export default Login;
