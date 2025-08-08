import React from 'react';
import styled from 'styled-components';
import Card from 'antd/es/card/Card';
import { useTheme } from '@mui/material/styles';
import { IoIosTrendingUp } from 'react-icons/io';
// Styled wrapper for the Card component
const StyledCard = styled(Card)`
  overflow: hidden;
  height: 100%;
  /* Targeting the card body */
  .ant-card-body {
    padding: 10px;
    height: 100%;
    width:${({ parent }) => (parent ? '100%;' : 'auto')} 
    display:${({ parent }) => (parent ? 'flex;' : '')}
    justify-content: ${({ parent }) => (parent ? 'space-around' : '')}
    align-items: ${({ parent }) => (parent ? 'center' : '')}
  }
  .name {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    color: ${({ theme }) => theme?.palette?.default_card?.color || 'black'};
  }
  &:hover .name {
    color: ${({ theme }) =>
      theme?.palette?.main_layout?.secondary_text || 'blue'};
  }
`;

const CustomCard = ({ style, title, children, parent, ...rest }) => {
  const theme = useTheme();

  return (
    <StyledCard
      theme={theme}
      bordered={false}
      parent={parent}
      style={{ ...style }}
      {...rest}
    >
      {children}
    </StyledCard>
  );
};

export default CustomCard;
