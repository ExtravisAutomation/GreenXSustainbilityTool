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
      }}
    >
      <CardContent style={{ padding: "0px" }}>{children}</CardContent>
    </Card>
  );
}
