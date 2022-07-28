import React from "react";
import ReactDOM from "react-dom";
import Router from "@/presentation/router/router";
import { makeLogin } from "@/main/factories/pages/login/login-factory";
import { makeSignUp } from "@/main/factories/pages/signup/signup-factory";

ReactDOM.render(
  <Router MakeLogin={makeLogin} MakeSignUp={makeSignUp} />,
  document.getElementById("main")
);
