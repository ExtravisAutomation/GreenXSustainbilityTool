import { Col, Row, Tag } from 'antd';
import React, { useState } from 'react';
import CustomSpin from '../../../components/CustomSpin';
import TopFiveDevicesTable from './TopFiveDevicesTable';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import CustomCard from '../../../components/customCard';
import styled from 'styled-components';

// styled components:
export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 6px;
  font-weight: 500;
  color: #c8cfda;
  cursor: pointer;
  outline: none;
  flex: 1;
  background-color: ${({ active }) => (active ? '#141D2A' : '#0F1620')};
  border: ${({ active }) => (active ? '1px solid #34404B' : 'none')};

  &:hover {
    background-color: #141d2a;
  }
`;
const dashboardButtons = [
  { key: 'co2', label: 'Carbon Emission' },
  { key: 'cost', label: 'Cost Estimation' },
  { key: 'efficiency', label: 'Energy Efficiency' },
  { key: 'utilization', label: 'Data Utilization' },
];

function TopFiveDevicesSection({ duration }) {
  const theme = useTheme();
  const [activeButton, setActiveButton] = useState(dashboardButtons[0]);

  const {
    data: topFiveDevicesData = {}, // default to empty object to avoid destructuring error
    loading: topFiveDevicesLoading,
    error: topFiveDevicesError,
  } = useSelector((state) => state.topFiveDevices);
  const {
    carbon_emission = [],
    data_utilization = [],
    cost_estimation = [],
    eer = [],
  } = topFiveDevicesData || {};
  console.log('topFiveDevices  Data:', topFiveDevicesData);

  const topFiveCostEstimationcolumns = (variant) => [
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',

      render: (text, record) => {
        return (
          <p
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: 'Cost Estimation (AED)',
      dataIndex: 'cost_estimation',
      key: 'cost_estimation',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },

    {
      title: 'Power Input (kW) ',
      dataIndex: 'power_input_kw',
      key: 'power_input_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Power Output (kW)',
      dataIndex: 'power_output_kw',
      key: 'power_output_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
  ];

  const topFiveDataUtilizationcolumns = (variant) => [
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',

      render: (text, record) => {
        return (
          <p
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: 'Data Utilization (%)',
      dataIndex: 'data_utilization_per',
      key: 'data_utilization_per',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },

    {
      title: 'Traffic Allocated (gb) ',
      dataIndex: 'traffic_allocated_gb',
      key: 'traffic_allocated_gb',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Traffic Consumed (gb) ',
      dataIndex: 'traffic_consumed_gb',
      key: 'traffic_consumed_gb',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
  ];
  const topFiveEnergyEfficiencycolumns = (variant) => [
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',

      render: (text, record) => {
        return (
          <p
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: 'Energy Efficiency (%)',
      dataIndex: 'eer',
      key: 'eer',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#CD4D4DB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },

    {
      title: 'Power Input (kW)',
      dataIndex: 'power_input_kw',
      key: 'power_input_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Power Output (kW)',
      dataIndex: 'power_output_kw',
      key: 'power_output_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
  ];

  const topFiveCarbonEmissioncolumns = (variant) => [
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',

      render: (text, record) => {
        return (
          <p
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: 'Co2 emission (kg)',
      dataIndex: 'carbon_emission_kg',
      key: 'carbon_emission_kg',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            textAlign: 'center', // horizontal alignment
            padding: '8px', // remove default padding
            minWidth: '50px',
          }}
        >
          {text}
        </Tag>
      ),
    },

    {
      title: 'Power Input (kW)',
      dataIndex: 'power_input_kw',
      key: 'power_input_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Power Output (kW)',
      dataIndex: 'power_output_kw',
      key: 'power_output_kw',
      align: 'center',
      render: (text) => (
        <Tag
          style={{
            // backgroundColor: '#844DCDB8',
            backgroundColor: variant === 'top' ? '#844DCDB8' : '#CD4D4DB8',
            color: '#E0E0E0',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 700,
            padding: '8px',
            border: 'none',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {text}
        </Tag>
      ),
    },
  ];

  const selectedData =
    activeButton?.key === 'co2'
      ? carbon_emission
      : activeButton?.key === 'efficiency'
        ? eer
        : activeButton?.key === 'cost'
          ? cost_estimation
          : data_utilization;
  const selectedColumns =
    activeButton?.key === 'co2'
      ? topFiveCarbonEmissioncolumns
      : activeButton?.key === 'efficiency'
        ? topFiveEnergyEfficiencycolumns
        : activeButton?.key === 'cost'
          ? topFiveCostEstimationcolumns
          : topFiveDataUtilizationcolumns;

  return (
    <CustomCard
      style={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
        backgroundColor: theme?.palette?.main_layout?.background,
        borderRadius: '7px',
        margin: '10px',
      }}
    >
      <p
        style={{
          fontSize: '16px',
          color: theme?.palette?.main_layout?.primary_text,
          marginBottom: '10px',
          marginTop: '0px',
          fontFamily: 'inter',
        }}
      >
        Devices {activeButton.label} Snapshot: Peak VS Low for last{' '}
        <span style={{ color: theme?.palette?.main_layout?.secondary_text }}>
          {duration}
        </span>
      </p>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {dashboardButtons.map((btn) => (
          <StyledButton
            key={btn.key}
            active={activeButton.key === btn.key}
            onClick={() => setActiveButton(btn)}
          >
            {btn.label}
          </StyledButton>
        ))}

        {/* <div>show compare</div> */}
      </div>
      <Row gutter={[16, 16]} style={{ padding: '10px' }}>
        <Col xs={24} lg={12}>
          <CustomSpin spinning={topFiveDevicesLoading}>
            <TopFiveDevicesTable
              title={'Peak Devices'}
              columns={selectedColumns('top')}
              spinnerLoading={topFiveDevicesLoading}
              dataSource={selectedData?.top}
              variant="top"
            />
          </CustomSpin>
        </Col>
        <Col xs={24} lg={12}>
          <CustomSpin spinning={topFiveDevicesLoading}>
            <TopFiveDevicesTable
              title={'Low Devices'}
              columns={selectedColumns('bottom')}
              spinnerLoading={topFiveDevicesLoading}
              dataSource={selectedData?.bottom}
              variant="bottom"
            />
          </CustomSpin>
        </Col>
      </Row>
    </CustomCard>
  );
}

export default TopFiveDevicesSection;
