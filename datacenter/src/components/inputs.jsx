import React from "react";
import { useTheme } from "@mui/material/styles";

export default function DefaultInput({
  field,
  type = "text",
  sx,
  children,
  ...rest
}) {
  const theme = useTheme();

  return (
    <input
      {...field}
      type={type}
      style={{
        borderStyle: "solid",
        color: theme?.palette?.default_input?.primary_text,
        backgroundColor: theme?.palette?.default_input?.background,
        borderColor: theme?.palette?.default_input?.border,
        borderRadius: "5px",
        padding: "5px 10px",
        width: "90%",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </input>
  );
}
