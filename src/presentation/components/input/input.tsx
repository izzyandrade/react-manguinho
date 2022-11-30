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
    <div
      className={Styles.inputWrap}
      data-status={props.error ? "invalid" : "valid"}
      data-testid={`${props.name}-wrap`}
    >
      <input
        {...props}
        title={props.error}
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
        title={props.error}
        data-testid={`${props.name}-label`}
      >
        {props.placeholder}
      </label>
    </div>
  );
};

export default Input;
