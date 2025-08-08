import { useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  padding-bottom: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ColorCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#ccc'};
`;

const Label = styled.span`
  color: ${(props) => props.color || '#ccc'};
  font-size: 12px;
  font-family: Inter, sans-serif;
`;

const LegendRow = ({ legendItems }) => {
  const theme = useTheme();
  return (
    <LegendContainer>
      {legendItems.map((item, idx) => (
        <LegendItem key={idx}>
          <ColorCircle color={item.color} />
          <Label color={theme?.palette?.main_layout?.primary_text}>
            {item.label}
          </Label>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

export default LegendRow;
