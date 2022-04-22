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
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getTitle = (): string => {
    return props.error || "Tudo certo!";
  };

  const getStatus = (): string => {
    return props.error ? "🔴" : "🟢";
  };

  return (
    <div className={Styles.inputWrap}>
      <input {...props} data-testid={props.name} onChange={handleChange} />
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
