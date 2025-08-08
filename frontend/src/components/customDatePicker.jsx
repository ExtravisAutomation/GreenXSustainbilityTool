import React from 'react';
import { DatePicker } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

const StyledDatePicker = styled(DatePicker)`
  border-radius: 5px;
  width: 100%;
  height: 32px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.default_input?.border || '#d9d9d9'} !important;
  background-color: ${({ theme }) =>
    theme?.palette?.default_select?.background || '#fff'};

  .ant-picker-input > input {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#000'};
    &::placeholder {
      color: ${({ theme }) =>
        theme?.palette?.default_select?.place_holder || '#999'};
      opacity: 1; /* Ensures full color visibility for the placeholder */
    }
  }

  .ant-picker-clear {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#999'};
    &:hover {
      color: ${({ theme }) =>
        theme?.palette?.default_select?.primary_text || '#999'};
    }
  }

  .ant-picker-suffix {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.place_holder || '#999'};
  }

  &:hover {
    border-color: ${({ theme }) =>
      theme?.palette?.default_select?.border || '#40a9ff'};
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#fff'};
  }

  .ant-picker-active-bar {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#1890ff'};
  }
`;

const CustomDatePicker = ({ onChange }) => {
  const theme = useTheme();

  return <StyledDatePicker theme={theme} onChange={onChange} />;
};

export default CustomDatePicker;
