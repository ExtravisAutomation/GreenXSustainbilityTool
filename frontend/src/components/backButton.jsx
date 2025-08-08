import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AppContext } from '../context/appContext';

const StyledButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme?.palette?.default_card?.color || '#e5e5e5'};
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;

  .back_icon {
    font-size: 17px;
  }

  span {
    margin-top: 1.7px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const BackButton = ({ style, ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setMenuVisible } = useContext(AppContext);
  return (
    <StyledButton
      theme={theme}
      style={style}
      onClick={() => {
        setMenuVisible((prev) => !prev);
        navigate(-1);
      }}
      {...rest}
    >
      <ArrowBackIosIcon className="back_icon" />
      <span>Back</span>
    </StyledButton>
  );
};

export default BackButton;
