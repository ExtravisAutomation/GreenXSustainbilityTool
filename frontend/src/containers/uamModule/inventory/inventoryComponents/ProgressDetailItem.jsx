import { theme } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const ValueContainer = styled.div`
  text-align: right;
`;

const Value = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.color};
`;

const MaxValue = styled.span`
  font-size: 0.75rem;
  color: #6b7280; /* text-gray-500 */
  margin-left: 0.25rem;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb; /* bg-gray-200 */
  border-radius: 9999px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 9999px;
  transition: width 0.7s ease-out;
  background-color: ${(props) =>
    props.color || '#3b82f6'}; /* default to blue */
  width: ${(props) => props.percentage}%;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
`;

const MidValue = styled.span`
  font-weight: 500;
`;

function ProgressDetailItem({
  label,
  value,
  percentage,
  maxValue,
  color,
  labelColor,
}) {
  return (
    <Wrapper>
      <Header>
        <Label color={labelColor}>{label}</Label>
        {/* <ValueContainer>
          <Value>{value}</Value>
          <MaxValue>/ {maxValue}</MaxValue>
        </ValueContainer> */}
      </Header>
      <ProgressBarBackground>
        <ProgressBarFill percentage={percentage} color={color} />
      </ProgressBarBackground>
      <Footer>
        <span>0%</span>
        {/* <MidValue>{maxValue / 2}%</MidValue> */}
        <MidValue>
          <Value color={color}>{value} %</Value>
        </MidValue>

        <span>100%</span>
      </Footer>
    </Wrapper>
  );
}

export default ProgressDetailItem;
