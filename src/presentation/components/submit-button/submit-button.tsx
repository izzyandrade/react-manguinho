import React, { useContext } from "react";
import FormContext from "@/presentation/contexts/form/form-context";

type Props = {
  text: string;
  style: string;
};

const SubmitButton: React.FC<Props> = ({ text, style }: Props) => {
  const { state } = useContext(FormContext);

  return (
    <button
      className={style}
      type="submit"
      data-testid="submit-button"
      disabled={state.isFormInvalid}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
