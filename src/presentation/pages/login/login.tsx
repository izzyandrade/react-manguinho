import React from "react";
import Styles from "./styles.scss";

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}></header>
      <form className={Styles.form}></form>
      <footer className={Styles.footer}></footer>
    </div>
  );
};

export default Login;
