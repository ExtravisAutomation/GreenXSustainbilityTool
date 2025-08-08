import React from 'react';
import { Row, Col, Card } from 'antd';
import styled from 'styled-components';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import CustomCard from '../../../components/customCard';
import { useTheme } from '@mui/material';
import { FiCopy } from 'react-icons/fi';
import { LuCopyX } from 'react-icons/lu';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { RiExchangeBoxLine } from 'react-icons/ri';

const ChartTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  margin: 0;
  letter-spacing: 1px;
  color: ${({ theme }) => theme?.palette?.graph?.title};
  margin-bottom: 12px;
`;
const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg || '#333'};
`;

const Label = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props?.theme?.palette?.available_options?.primary_text};
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.color};
`;

const CardsSection = ({
  psu_stats,
  stack_stats,
  traffic_throughput_kw_per_gb,
  pcr_kw_per_gb,
}) => {
  const theme = useTheme();
  return (
    <Row gutter={[16, 16]}>
      {/* Power Supply Unites */}
      <Col xs={24} sm={12} lg={8}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <ChartTitle>Power Supply Status </ChartTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#22C1A73D">
                <CheckCircleOutlined
                  style={{ color: '#2dd4bf', fontSize: 24 }}
                />
              </IconBox>
              <Label theme={theme}>Active</Label>
              <Value color={theme?.palette?.shades?.light_green}>
                {psu_stats?.active_psu}
              </Value>
            </div>
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#ED3A313D">
                <CloseCircleOutlined
                  style={{ color: theme?.palette?.shades?.red, fontSize: 24 }}
                />
              </IconBox>
              <Label theme={theme}>Inactive</Label>
              <Value color={theme?.palette?.shades?.red}>
                {psu_stats?.non_active_psu}
              </Value>
            </div>
          </div>
        </CustomCard>
      </Col>
      {/* Stacked Devices */}
      <Col xs={24} sm={12} lg={8}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <ChartTitle>Device Stacking Status</ChartTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#7523B23D">
                <FiCopy
                  style={{
                    color: theme?.palette?.shades?.purple,
                    fontSize: 24,
                  }}
                />
              </IconBox>
              <Label theme={theme}>Stacked</Label>
              <Value color={theme?.palette?.shades?.purple}>
                {stack_stats?.stacked}
              </Value>
            </div>
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#7523B23D">
                <LuCopyX
                  style={{
                    color: theme?.palette?.shades?.purple,
                    fontSize: 24,
                  }}
                />
              </IconBox>
              <Label theme={theme}>Unstacked</Label>
              <Value color={theme?.palette?.shades?.purple}>
                {stack_stats?.unstacked}
              </Value>
            </div>
          </div>
        </CustomCard>
      </Col>

      <Col xs={24} sm={12} lg={8}>
        <CustomCard
          style={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            backgroundColor: theme?.palette?.main_layout?.background,
            borderRadius: '7px',
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          <ChartTitle>Traffic Analysis</ChartTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#01A5DE47">
                <AiOutlineThunderbolt
                  style={{
                    color: theme?.palette?.shades?.light_blue,
                    fontSize: 24,
                  }}
                />
              </IconBox>
              <Label theme={theme}>Power Consumption Ratio</Label>
              <Value color={theme?.palette?.shades?.light_blue}>
                {pcr_kw_per_gb}
              </Value>
            </div>
            <div
              className="card"
              style={{
                backgroundColor:
                  theme?.mode == 'dark' ? '#0F1620' : '#f7faffff',
                padding: '16px',
                borderRadius: '8px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <IconBox bg="#01A5DE47">
                <RiExchangeBoxLine
                  style={{
                    color: theme?.palette?.shades?.light_blue,
                    fontSize: 24,
                  }}
                />
              </IconBox>
              <Label theme={theme}>Traffic Throughput</Label>
              <Value color={theme?.palette?.shades?.light_blue}>
                {traffic_throughput_kw_per_gb}
              </Value>
            </div>
          </div>
        </CustomCard>
      </Col>
    </Row>
  );
};

export default CardsSection;
