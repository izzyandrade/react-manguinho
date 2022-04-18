import React from "react";
import Styles from "./styles.scss";
import LoginHeader from "@/presentation/components/login-header/login-header";
import Footer from "@/presentation/components/footer/footer";
import Input from "@/presentation/components/input/input";
import FormStatus from "@/presentation/components/form-status/form-status";

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
