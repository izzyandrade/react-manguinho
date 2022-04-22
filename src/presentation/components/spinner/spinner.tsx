/* eslint-disable react/prop-types */
import React from "react";
import Styles from "./styles.scss";

type Props = React.HTMLAttributes<HTMLElement>;

const Spinner: React.FC<Props> = (props: Props) => {
  return (
    <div
      {...props}
      className={[Styles.spinner, props.className].join(" ")}
      data-testid="spinner"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
