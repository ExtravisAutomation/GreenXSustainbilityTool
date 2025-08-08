import React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import DefaultButton from "../../../components/buttons";
const Index = () => {
  const theme = useTheme();
  return (
    <div>
      <div
        className="text-[red]"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Failed Devices
      </div>
      <Button
        sx={{ background: "red", backgroundColor: theme.palette.primary.main }}
      >
        Hello world
      </Button>
      <DefaultButton
        sx={{}}
        handleClick={() => {
          console.log("clicked");
        }}
      >
        Default Button
      </DefaultButton>
    </div>
  );
};

export default Index;
