import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

// Styled wrapper for the Card component
const StyledCard = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme?.palette?.divider || "#e0e0e0"};
  border-radius: 4px;
  background-color: ${({ theme }) => theme?.palette?.background?.paper || "white"};
  padding: ${({ padding }) => padding };
  margin: ${({ margin }) => margin };

  .name {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    color: ${({ theme }) => theme?.palette?.default_card?.color || "black"};
  }
  &:hover .name {
    color: ${({ theme }) => theme?.palette?.main_layout?.secondary_text || "blue"};
  }
`;

const Card = ({ style, title, children, padding, margin, ...rest }) => {
  const theme = useTheme();

  return (
    <StyledCard theme={theme} style={{ ...style }} padding={padding} margin={margin} {...rest}>
      {children}
    </StyledCard>
  );
};

export default Card;
