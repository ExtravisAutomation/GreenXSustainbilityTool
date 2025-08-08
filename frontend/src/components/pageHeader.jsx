import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "./buttons";
import { Typography } from "@mui/material";

export default function PageHeader({ pageName, buttons, setOpen }) {
  const theme = useTheme();

  const renderButton = (buttonNamePostfix, buttons) => {
    const { type, icon, handleClick, options } = buttons;
    console.log(handleClick, "handleClickhandleClickhandleClick");
    console.log(type, "btn type");
    let sx = null;
    console.log(type, "typeee");
    if (type == "Export") {
      sx = {
        backgroundColor: theme?.palette?.drop_down_button?.export_background,
        color: theme?.palette?.drop_down_button?.export_text,
      };
    } else if (type === "Onboard") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.onboard_background,
      };
    } else if (type === "Delete") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.delete_background,
      };
    } else if (type === "Add Site") {
      if (options) {
        sx = {
          backgroundColor: theme?.palette?.drop_down_button?.add_background,
          color: theme?.palette?.drop_down_button?.add_text,
        };
      } else {
        sx = {
          backgroundColor: theme?.palette?.drop_down_button?.add_background,
        };
      }
    } else if (type === "Import") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.import_background,
      };
    } else if (type === "Table Configurations") {
      sx = {
        backgroundColor: theme?.palette?.default_button?.onboard_background,
      };
    }

    if (options) {
      return (
        <DropDownButton
          key={type}
          handleClick={handleClick}
          sx={sx}
          options={options}
        >
          {icon}
          {type === "Add" ? `${type} ${buttonNamePostfix}` : type}
        </DropDownButton>
      );
    } else {
      return (
        <DefaultButton key={type} handleClick={handleClick} sx={sx}>
          {icon}
          {type === "Add" ? `${type} ${buttonNamePostfix}` : type}
        </DefaultButton>
      );
    }
  };

  return (
    <div>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme?.palette?.page_header?.primary_text }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {buttons.map((button) => renderButton(pageName, button))}
        </Typography>
      </Typography>
    </div>
  );
}
