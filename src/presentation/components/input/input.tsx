import React from "react";
import Styles from "./styles.scss";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  status: string;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const { status } = props;
  return (
    <div className={Styles.inputWrap}>
      <input {...props} />
      <span data-testid={`${props.name}-status`} className={Styles.inputStatus}>
        {status}
      </span>
    </div>
  );
};

export default Input;
