import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";

export default function DefaultCard({ sx, children }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...sx,
        position: "relative",
        backgroundColor: theme?.palette?.default_card?.background,
        // backgroundColor: "#050C17",

        // border: "1px solid #36424E",
        padding: "10px",
        width: "96%",
        margin: "0 auto",
        marginTop: "10px",
        marginBottom: "10px !important",
      }}
    >
      {children}
      {/* <CardContent style={{ padding: "0px" }}>{children}</CardContent> */}
    </Card>
  );
}
