import React, { useState } from "react";
import { Button } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

export default function DefaultButton({ sx, handleClick, children, ...rest }) {
  const theme = useTheme();

  return (
    <Button
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "5px 12px",
        color: theme?.palette?.default_button?.primary_text,
        "&:hover": {
          backgroundColor: sx?.backgroundColor,
          opacity: 0.95,
        },
        ...sx,
      }}
      {...rest}
      onClick={handleClick}
    >
      {children.length > 1 ? children[0] : null}
      <span style={{ fontSize: "13px", textTransform: "capitalize" }}>
        {children.length > 1 ? children[1] : children[0]}
      </span>
    </Button>
  );
}

export function DropDownButton({
  sx,
  handleClick,
  children,
  options,
  ...rest
}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const StyledDiv = styled("div")(({ theme, sx }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: `1px solid ${theme?.palette?.drop_down_button?.border}`,
    color: sx?.color,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: sx?.backgroundColor,
      opacity: 0.95,
    },
  }));

  const DropdownOptions = styled("div")(({ theme }) => ({
    position: "absolute",
    zIndex: "99999",
    top: "100%",
    right: 0,
    width: "110%",
    backgroundColor: theme?.palette?.drop_down_button?.options_background,
    border: `1px solid ${theme?.palette?.drop_down_button?.border}`,
    borderRadius: "0 0 2px 2px",
    zIndex: 2,
    display: isOpen ? "block" : "none",
  }));

  const StyledOption = styled("div")(({ theme, sx }) => ({
    color: theme?.palette?.drop_down_button?.options_text,
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor:
        theme?.palette?.drop_down_button?.options_hover_background,
      color: theme?.palette?.drop_down_button?.options_hover_text,
    },
    ...sx,
  }));

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionType) => {
    setIsOpen(false);
    handleClick(optionType);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onClick={handleButtonClick}
      {...rest}
    >
      <div style={{ display: "flex" }}>
        <StyledDiv
          sx={{
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            padding: "5px 12px 6px 12px",
            borderRight: "none",
            ...sx,
          }}
        >
          {children.length > 1 ? children[0] : null}
          <span style={{ fontSize: "13px", textTransform: "capitalize" }}>
            {children.length > 1 ? children[1] : children[0]}
          </span>
        </StyledDiv>
        <StyledDiv
          sx={{
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
            padding: "5px 5px 6px 5px",
            ...sx,
          }}
        >
          <Icon fontSize="16px" icon="icon-park-outline:down" />
        </StyledDiv>
      </div>
      <DropdownOptions>
        {options.map((option) => (
          <StyledOption
            key={option.type}
            onClick={() => handleOptionClick(option.type)}
            sx={{ display: "flex" }}
          >
            {option.icon}
            &nbsp;&nbsp;
            <div style={{ marginTop: "-2px" }}>{option.type}</div>
          </StyledOption>
        ))}
      </DropdownOptions>
    </div>
  );
}
