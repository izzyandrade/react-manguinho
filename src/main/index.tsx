import React from "react";
import ReactDOM from "react-dom";
import Router from "@/presentation/router/router";
import { makeLogin } from "@/main/factories/pages/login/login-factory";

ReactDOM.render(
  <Router MakeLogin={makeLogin} />,
  document.getElementById("main")
);
