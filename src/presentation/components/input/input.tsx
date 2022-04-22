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

const Input: React.FC<InputProps> = (props: InputProps) => {
  const { setState, state } = useContext(FormContext);

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const getStatus = (): string => {
    return props.error ? "🔴" : "🟢";
  };

  const getTitle = (): string => {
    return props.error || "Tudo certo!";
  };

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        data-testid={props.name}
        onChange={handleChange}
        value={state[props.name]}
      />
      <span
        title={getTitle()}
        data-testid={`${props.name}-status`}
        className={Styles.inputStatus}
      >
        {getStatus()}
      </span>
    </div>
  );
};

export default Input;
