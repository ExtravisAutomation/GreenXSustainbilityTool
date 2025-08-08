// import { useTheme } from '@emotion/react';
import { useTheme } from '@mui/material';
import { Card, Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1.5rem 0rem 0;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 1rem;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const LabelText = styled.span`
  color: white;
  font-size: 12px;
  font-weight: 400;
`;

// const ProgressBarContainer = styled.div`
//   flex: 1;
//   margin: 0 1.5rem;
//   height: 2rem;
//   background-color: #334155; // slate-700
//   border-right: 2px solid #475569; // slate-600
//   border-radius: 4px;
//   position: relative;
//   overflow: hidden;
// `;

// const ProgressBarFill = styled.div`
//   height: 100%;
//   border-radius: 4px;
//   transition: width 1s ease-out;
//   border-right: 3px solid white;
//   background: ${({ type }) =>
//     type === 'up'
//       ? 'linear-gradient(to right, rgba(13,148,136,0.3), #34d399)' // teal to emerald
//       : 'linear-gradient(to right, rgba(220,38,38,0.3), #ef4444)'}; // red shades
//   width: ${({ percentage }) => percentage}%;
//   position: relative;
// `;
const ProgressBarContainer = styled.div`
  margin: 0;
  background-color: #ffffff33; // slate-700
  border-radius: 0px;
  position: relative;
  overflow: visible; // allow fill to overflow
  height: 7px; // smaller container height
`;

const ProgressBarFill = styled.div`
  height: 35px; // larger fill height than container
  margin-top: -14px; // visually center the bar inside container
  border-radius: 0px;
  transition: width 1s ease-out;
  background: ${({ type }) =>
    type === 'up'
      ? 'linear-gradient(to right, rgba(13,148,136,0.3), #34d399)'
      : 'linear-gradient(to right, rgba(220,38,38,0.3), #ef4444)'};
  width: ${({ percentage }) => percentage}%;
  position: relative;
  z-index: 1;
  border-right: 10px solid white;
`;

const Percentage = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

// Cards code:
const StatsGrid = styled.div`
  margin-top: 4.5rem;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0px 12px;
`;

const StatCard = styled(Card)`
  min-width: 120px;
  height: 42px;
  background-color: #0f1620 !important; // Tailwind: bg-slate-800
  border: 1px solid #334155; // Tailwind: border-slate-600
  border-radius: 0.5rem;
  padding: 1rem;

  .ant-card-body {
    padding: 0;
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

const CardLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

function Interfaces({ metricsData }) {
  // console.log(metricsData?.interface_stats);

  const interfaceData = metricsData?.interface_stats;

  const theme = useTheme();
  return (
    <>
      <SectionWrapper>
        {/* UP Section */}
        <ProgressRow>
          <LabelWrapper>
            {/* <ArrowUpOutlined style={{ color: '#34d399', fontSize: '20px' }} /> */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label>
                <span style={{ paddingTop: '4px' }}>
                  <HiArrowSmUp
                    color={theme?.palette?.shades?.light_green}
                    size={20}
                  />
                </span>{' '}
                <LabelText>Up</LabelText>
              </Label>
              <Percentage>{interfaceData?.up_link_percentage} %</Percentage>
            </div>
            <ProgressBarContainer>
              <ProgressBarFill
                type="up"
                percentage={interfaceData?.up_link_percentage}
              >
                {/* <GlossyLine /> */}
              </ProgressBarFill>
            </ProgressBarContainer>
          </LabelWrapper>
        </ProgressRow>

        {/* DOWN Section */}
        <ProgressRow>
          <LabelWrapper>
            {/* <ArrowDownOutlined style={{ color: '#f87171', fontSize: '20px' }} /> */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label>
                <span style={{ paddingTop: '4px' }}>
                  <HiArrowSmDown
                    color={theme?.palette?.shades?.red}
                    size={20}
                  />
                </span>{' '}
                <LabelText>Down</LabelText>
              </Label>
              <Percentage>{interfaceData?.down_link_percentage} %</Percentage>
            </div>
            <ProgressBarContainer>
              <ProgressBarFill
                type="down"
                percentage={interfaceData?.down_link_percentage}
              >
                {/* <GlossyLine /> */}
              </ProgressBarFill>
            </ProgressBarContainer>
          </LabelWrapper>
        </ProgressRow>
      </SectionWrapper>
      <StatsGrid>
        <StatCard>
          <LabelText>Total</LabelText>
          <Value
            style={{ color: theme?.palette?.available_options?.primary_text }}
          >
            {interfaceData?.total_interface}
          </Value>{' '}
          {/* text-slate-300 */}
        </StatCard>

        <StatCard>
          <LabelText>Up</LabelText>
          <Value style={{ color: theme?.palette?.shades?.light_green }}>
            {interfaceData?.total_up_links}
          </Value>
        </StatCard>

        <StatCard>
          <LabelText>Down</LabelText>
          <Value style={{ color: theme?.palette?.shades?.red }}>
            {' '}
            {interfaceData?.total_down_links}
          </Value>
        </StatCard>
      </StatsGrid>
    </>
  );
}

export default Interfaces;
