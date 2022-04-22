import React, { useContext } from "react";
import Styles from "./styles.scss";
import FormContext from "@/presentation/contexts/form/form-context";
interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error: string;
}

const Input: React.FC<InputProps> = ({ error, name, ...props }: InputProps) => {
  const { setState, state } = useContext(FormContext);

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const getTitle = (): string => {
    return error || "Tudo certo!";
  };

  const getStatus = (): string => {
    return error ? "🔴" : "🟢";
  };

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        data-testid={name}
        onChange={handleChange}
        value={state[name]}
      />
      <span
        title={getTitle()}
        data-testid={`${name}-status`}
        className={Styles.inputStatus}
      >
        {getStatus()}
      </span>
    </div>
  );
};

export default Input;
