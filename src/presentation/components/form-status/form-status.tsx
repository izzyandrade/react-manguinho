import React, { useContext } from "react";
import Styles from "./styles.scss";
import { Spinner } from "@/presentation/components";
import FormContext from "@/presentation/contexts/form/form-context";

const FormStatus: React.FC = () => {
  const { state } = useContext(FormContext);
  const { isLoading, errorMessage } = state;
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {errorMessage && (
        <span data-testid="main-error" className={Styles.error}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FormStatus;
