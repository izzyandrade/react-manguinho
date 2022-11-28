import React, { useContext, useRef } from "react";
import Styles from "./styles.scss";
import FormContext from "@/presentation/contexts/form/form-context";
interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: string;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const { setState, state } = useContext(FormContext);
  const inputRef = useRef<HTMLInputElement>();

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        data-testid={props.name}
        onChange={handleChange}
        placeholder=" "
        ref={inputRef}
      />
      <label
        onClick={() => {
          inputRef.current.focus();
        }}
        htmlFor={props.name}
      >
        {props.placeholder}
      </label>
      <span
        title={props.error || "Tudo certo!"}
        data-testid={`${props.name}-status`}
        className={Styles.inputStatus}
      >
        {props.error ? "🔴" : "🟢"}
      </span>
    </div>
  );
};

export default Input;
