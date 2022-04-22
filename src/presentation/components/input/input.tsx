import React, { useContext } from "react";
import Styles from "./styles.scss";
import FormContext from "@/presentation/contexts/form/form-context";
interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  errorMessage: string;
  status: string;
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

  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        data-testid={props.name}
        onChange={handleChange}
        value={state[props.name]}
      />
      <span
        title={props.errorMessage}
        data-testid={`${props.name}-status`}
        className={Styles.inputStatus}
      >
        {props.status}
      </span>
    </div>
  );
};

export default Input;
