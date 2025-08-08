import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';
import { useTheme } from '@emotion/react';

// Styled spin component
const StyledSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: ${(props) =>
      props.$themecolor || '#1890ff'}; /* fallback color */
  }
`;

// Reusable wrapper component
const CustomSpin = ({ spinning, children }) => {
  const theme = useTheme();
  const color = theme?.palette?.main_layout?.secondary_text;

  return (
    <StyledSpin $themecolor={color} spinning={spinning}>
      {children}
    </StyledSpin>
  );
};

export default CustomSpin;
