import React, { memo } from "react";
import Styles from "./styles.scss";
import { Logo } from "@/presentation/components";

const LoginHeader: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo />
      <h1>4Dev - Enquetes para Devs</h1>
    </header>
  );
};

export default memo(LoginHeader);
