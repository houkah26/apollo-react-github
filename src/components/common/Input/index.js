import React from "react";

import "./index.css";

const Input = ({ children, color = "black", ...props }) => (
  <input className={`Input Input_${color}`} {...props}>
    {children}
  </input>
);

export default Input;
