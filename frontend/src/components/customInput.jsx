import React from 'react';
import { Input } from 'antd';
import styled, { css } from 'styled-components';
import { useTheme } from '@mui/material/styles';

const inputHeight = ({ nested, pueMode }) => css`
  height: ${nested ? '39px' : pueMode ? '38px' : '42px'} !important;
`;
const StyledInput = styled(Input)`
  border-radius: 5px;
  border: ${({ theme, pueMode, currency }) =>
    currency || pueMode
      ? 'none'
      : `1px solid ${theme?.palette?.default_input?.border}`} !important;

  color: ${({ theme }) =>
    theme?.palette?.default_input?.primary_text || 'black'} !important;
  ${inputHeight};
  background: ${({ theme }) =>
    theme?.palette?.default_input?.background || 'black'} !important;
  // color: #e5e5e5 !important;
  // border: 1px solid #36424e;
  &::placeholder {
    color: gray;
  }
  &:focus,
  &:hover,
  &.ant-input-focused {
    box-shadow: none !important;
    ${({ theme, pueMode, currency }) =>
      pueMode || currency
        ? 'border: none !important;'
        : `border: 1px solid ${theme?.palette?.default_input?.border} !important;`}
  }
`;
const StyledPasswordInput = styled(Input.Password)`
  color: ${({ theme }) =>
    theme?.palette?.default_input?.primary_text || 'black'} !important;
  padding: 0 11px !important;

  .ant-input-password-icon {
    svg {
      fill: ${({ theme }) =>
        theme?.palette?.default_input?.primary_text || '#e5e5e5'} !important;
    }
  }
  // input {
  //   border: none !important;
  //   border-radius: 0 !important;
  // }
  input {
    border: none !important;
    border-radius: 0 !important;
    color: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || '#e5e5e5'} !important;

    &::placeholder {
      color: ${({ theme }) =>
        theme?.palette?.default_input?.primary_text || '#e5e5e5'} !important;
      opacity: 1;
    }
  }

  border-radius: 5px;
  ${inputHeight};

  .ant-input-affix-wrapper {
    background: ${({ theme }) =>
      theme?.palette?.default_input?.background || 'black'} !important;
    color: ${({ theme }) =>
      theme?.palette?.default_input?.primary_text || '#e5e5e5'} !important;

    
`;

export const CustomInput = ({
  placeholder,
  style,
  type,
  value,
  onChange,
  pueMode,
  currency,
  // password,
  nested,
  ...rest
}) => {
  const theme = useTheme();

  if (type === 'password') {
    return (
      // <StyledPasswordInput
      //   theme={theme}
      //   {...rest}
      //   nested={nested}
      //   style={{
      //     color: theme?.palette?.main_layout?.primary_text,
      //     backgroundColor: theme.palette.default_input.background,
      //     border: `1px solid ${theme.palette.default_input.border}`,
      //     ...style,
      //   }}
      //   placeholder={placeholder}
      // />
      <StyledPasswordInput
        theme={theme}
        {...rest}
        nested={nested}
        value={value}
        onChange={onChange}
        style={{
          color: theme?.palette?.main_layout?.primary_text,
          backgroundColor: theme.palette.default_input.background,
          border: `1px solid ${theme.palette.default_input.border}`,
          ...style,
        }}
        placeholder={placeholder}
      />
    );
  }
  return (
    <>
      <StyledInput
        nested={nested}
        theme={theme}
        value={value} // ✅ Critical for AntD forms
        onChange={onChange}
        {...rest}
        style={{
          ...style,
        }}
        pueMode={pueMode}
        currency={currency}
        placeholder={placeholder}
      />
    </>
  );
};
