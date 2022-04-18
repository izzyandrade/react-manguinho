import React from "react";
import Styles from "./styles.scss";
import Spinner from "@/presentation/components/spinner/spinner";
import Logo from "@/presentation/components/logo/logo";

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <Logo />
        <h1>4Dev - Enquetes para Devs</h1>
      </header>
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrap}>
          <input type="email" name="email" placeholder="Insira seu email" />
          <span className={Styles.inputStatus}>🔴</span>
        </div>
        <div className={Styles.inputWrap}>
          <input
            type="password"
            name="password"
            placeholder="Insira sua senha"
          />
          <span className={Styles.inputStatus}>🔴</span>
        </div>

        <button type="submit">Entrar</button>
        <span className={Styles.signUpLink}>
          Não tem uma conta? Cadastre-se
        </span>
        <div className={Styles.errorWrap}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro!</span>
        </div>
      </form>
      <footer className={Styles.footer} />
    </div>
  );
};

export default Login;
