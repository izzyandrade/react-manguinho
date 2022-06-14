import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/presentation/styles/global.scss";
import { makeLogin } from "@/main/factories/pages/login/login-factory";

type Props = {};

const Router: React.FC<Props> = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={makeLogin({})} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
