import React, { useEffect, useState } from "react";
import Styles from "./styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
  SubmitButton,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";
import { Validation } from "@/presentation/protocols/validation";
import { Authentication, SaveAccessToken } from "@/domain/usecases";
import { useNavigate } from "react-router-dom";

type State = {
  isLoading: boolean;
  isFormInvalid: boolean;
  errorMessage: string;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
};

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken,
}: Props) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    isFormInvalid: true,
    errorMessage: "",
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const emailError = validation.validate("email", state.email);
    const passwordError = validation.validate("password", state.password);
    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError,
    });
  }, [state.email, state.password]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.isFormInvalid) return;
      setState({
        ...state,
        isLoading: true,
      });
      const response = await authentication.auth({
        email: state.email,
        password: state.password,
      });
      saveAccessToken.save(response.accessToken);
      navigate("/", { replace: true });
    } catch (err) {
      setState({ ...state, errorMessage: err.message, isLoading: false });
    }
  };

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          onSubmit={handleSubmit}
          data-testid="form"
        >
          <h2>Login</h2>
          <Input
            type="email"
            name="email"
            placeholder="Insira seu email"
            error={state.emailError}
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            error={state.passwordError}
          />
          <SubmitButton style={Styles.submit} text="Entrar" />
          <span
            onClick={() => {
              navigate("/signup");
            }}
            className={Styles.signUpLink}
            data-testid="signup-link"
          >
            Não tem uma conta? Cadastre-se
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Login;
