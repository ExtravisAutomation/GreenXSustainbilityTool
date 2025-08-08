import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { Switch } from 'antd';
import GaugeChart from '../../../../components/GaugeChart';
import { useTheme } from '@mui/material';
import { FaChartBar, FaListAlt } from 'react-icons/fa';
// import { GaugeChart } from 'echarts/charts';
const Card = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: ${(props) => props.bgColor || '#ffffff'};
  position: relative;
  border: 1px solid ${(props) => props.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Title = styled.span`
  font-weight: 500;
  color: ${(props) => props.titleText || '#000'};
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Value = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.textColor || '#000'};
`;

const Change = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => (props.positive ? '#30472b' : '#dc2626')};
`;
// const SwitchContainer = styled.div`
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
// `;
const ToggleButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  // background: #f0f0f0;
  border: none;
  padding: 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: background 0.2s;

  &:hover {
    // background: #e2e8f0;
    cursor: pointer;
  }
`;

function RackDetailCard({
  title,
  value,
  change,
  positive,
  icon,
  bgColor,
  textColor,
  titleText,
  handleClick,
  showChart,
  chartProps,
}) {
  // const [showEnergyChart, setShowEnergyChart] = useState(false);
  const theme = useTheme();
  console.log('chart props::::', showChart);

  return (
    <Card bgColor={bgColor} border={theme?.palette?.default_card?.border}>
      {showChart ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // border: ,
          }}
        >
          <GaugeChart
            value={value}
            color={chartProps?.color}
            trackColor={chartProps?.trackColor}
            size={chartProps?.size}
            min={chartProps?.min}
            max={chartProps?.max}
            rackpage={true}
          />
        </div>
      ) : (
        <>
          <CardHeader>
            <Title titleText={titleText}>{title}</Title>
            {icon}
          </CardHeader>
          <ValueContainer>
            <Value textColor={textColor}>{value}</Value>
            <Change positive={positive}>{change}</Change>
          </ValueContainer>
        </>
      )}
      {/* <SwitchContainer>
        <Switch checked={showChart} onChange={() => setShowChart(!showChart)} />
      </SwitchContainer> */}

      <ToggleButton
        // onClick={handleClick}
        style={{
          color: textColor,
          background: theme?.mode == 'dark' ? 'transperant' : '#f0f0f0',
        }}
      >
        {showChart ? <FaListAlt /> : <FaChartBar />}
        {/* {showEnergyChart ? 'Show Data' : 'Show Chart'} */}
      </ToggleButton>
    </Card>
  );
}

export default RackDetailCard;
