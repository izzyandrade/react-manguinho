import React, { useEffect, useState } from "react";
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton,
} from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";
import Styles from "./styles.scss";
import { Validation } from "@/presentation/protocols/validation";
import { AddAccount, SaveAccessToken } from "@/domain/usecases";
import { useNavigate } from "react-router-dom";

type State = {
  isLoading: boolean;
  isFormInvalid: boolean;
  errorMessage: string;
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  emailError: string;
  nameError: string;
  passwordError: string;
  passwordConfirmationError: string;
};

type SignUpProps = {
  validation: Validation;
  addAccount: AddAccount;
  saveAccessToken: SaveAccessToken;
};

const SignUp: React.FC<SignUpProps> = ({
  validation,
  addAccount,
  saveAccessToken,
}) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    isFormInvalid: true,
    errorMessage: "",
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
    emailError: "",
    nameError: "",
    passwordError: "",
    passwordConfirmationError: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const { email, name, password, passwordConfirmation } = state;
    const formData = { email, name, password, passwordConfirmation };
    const emailError = validation.validate("email", formData);
    const nameError = validation.validate("name", formData);
    const passwordError = validation.validate("password", formData);
    const passwordConfirmationError = validation.validate(
      "passwordConfirmation",
      formData
    );
    setState({
      ...state,
      emailError,
      nameError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid:
        !!nameError ||
        !!emailError ||
        !!passwordError ||
        !!passwordConfirmationError,
    });
  }, [state.email, state.password, state.name, state.passwordConfirmation]);

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
      const account = await addAccount.add({
        email: state.email,
        name: state.name,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
      saveAccessToken.save(account.accessToken);
      navigate("/", { replace: true });
    } catch (err) {
      setState({ ...state, errorMessage: err.message, isLoading: false });
    }
  };

  return (
    <div className={Styles.signUp}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
          data-testid="form"
          onSubmit={handleSubmit}
        >
          <h2>Cadastre-se</h2>
          <Input
            type="email"
            name="email"
            placeholder="Insira seu email"
            error={state.emailError}
          />
          <Input
            type="text"
            name="name"
            placeholder="Insira seu nome"
            error={state.nameError}
          />
          <Input
            type="password"
            name="password"
            placeholder="Insira sua senha"
            error={state.passwordError}
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirme sua senha"
            error={state.passwordConfirmationError}
          />
          <SubmitButton style={Styles.submit} text="Cadastrar" />

          <span
            onClick={() => {
              navigate("/login");
            }}
            className={Styles.loginLink}
            data-testid="login-link"
          >
            Já tem uma conta? Clique para entrar
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
