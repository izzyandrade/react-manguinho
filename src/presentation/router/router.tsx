import "@/presentation/styles/global.scss";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "@/presentation/pages";

type Props = {
  MakeLogin: React.FC;
  MakeSignUp: React.FC;
};

const Router: React.FC<Props> = ({ MakeLogin }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
