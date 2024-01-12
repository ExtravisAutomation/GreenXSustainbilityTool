import React from "react";
import { useTheme } from "@mui/material/styles";

export default function DefaultSelect({ field, sx, children, ...rest }) {
  const theme = useTheme();

  return (
    <select
      {...field}
      style={{
        color: theme?.palette?.default_option?.primary_text,
        backgroundColor: theme?.palette?.default_option?.background,
        border: `2px solid ${theme?.palette?.default_option?.border}`,
        borderRadius: "5px",
        padding: "5px 10px",
        width: "100%",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
