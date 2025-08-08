import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material/styles";

const StyledSearch = styled(Input)`
  width: ${(props) => props.width || "200px"};
  border-radius: 4px;
  height: 33px;

  border-color: ${({ theme }) =>
    theme?.palette?.default_input?.border || "black"} !important;
  background-color: ${({ theme }) =>
    theme?.palette?.default_input?.background || "black"} !important;

  &::placeholder {
    color: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || "black"} !important;
  }

  .ant-input {
    color: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || "black"} !important;
  }

  .ant-input-clear-icon {
    color: ${(props) => props.clearIconColor || "#000"};
    background-color: ${({ theme }) =>
      theme?.palette?.default_input?.background || "black"} !important;
  }
`;

const CustomSearch = ({
  width,
  placeholder = "input search text",
  onChange,
}) => {
  const theme = useTheme();

  return (
    <StyledSearch
      theme={theme}
      placeholder={placeholder}
      allowClear
      onChange={onChange}
      width={width}
      addonBefore={<SearchOutlined />}
    />
  );
};

export default CustomSearch;
