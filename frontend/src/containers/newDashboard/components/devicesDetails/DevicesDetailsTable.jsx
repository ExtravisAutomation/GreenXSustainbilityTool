import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import { DatePicker, Progress, Tooltip } from 'antd';
import DefaultCard from '../../../../components/cards';
import ExportButton from '../../../../components/exportButton.jsx';
import CustomSpin from '../../../../components/CustomSpin.jsx';
// import DefaultTable from '../../../components/tables';
// import BackButton from '../../../components/backButton.jsx';
// import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { CustomInput } from '../../../../components/customInput.jsx';
import useWindowDimensions from '../../../../hooks/useWindowDimensions.js';
import BackButton from '../../../../components/backButton.jsx';
import DefaultTable from '../../../../components/tables.jsx';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios/axiosInstance.js';
import { FaTruckLoading } from 'react-icons/fa';

const CustomProgressWrapper = styled.div`
  width: 90%;

  .ant-progress-inner {
    background-color: #141b26 !important; // track color
    height: 14px !important;
    border-radius: 2px !important;
  }

  .ant-progress-bg {
    height: 14px !important;
    background: ${({ type }) =>
      type === 'up'
        ? 'linear-gradient(to right, rgba(13,148,136,0.3), #34d399)'
        : 'linear-gradient(to right, rgba(220,38,38,0.3), #ef4444)'};
    border-radius: 2px !important;
  }

  .ant-progress-outer {
    margin-inline-end: 0 !important;
  }
`;

const DevicesDetailsTable = () => {
  const location = useLocation();
  const { siteId, duration } = location.state || {};
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const testdata = [
    {
      time: '2025-08-03 18:00',
      input_kw: 0,
      output_kw: 0,
      traffic_consumed_gb: 0.0017,
      traffic_allocated_gb: 10,
      eer: 89,
      pue: 0,
      pcr: 0,
      throughput: 0,
      cost_estimation: 0,
      carbon_emission_kg: 0,
      carbon_emission_tons: 0,
      data_utilization: 0.016581,
      ip_address: '1.1.1.1',
      device_name: 'R_167_SW_01',
      device_id: 3336,
      site_name: 'SULAY',
      pn_code: 'X450a-24tdc',
      rack_name: 'L0-AF-13',
    },
    {
      time: '2025-08-03 18:00',
      input_kw: 0,
      output_kw: 0,
      traffic_consumed_gb: 0.0017,
      traffic_allocated_gb: 10,
      eer: 76,
      pue: 0,
      pcr: 0,
      throughput: 0,
      cost_estimation: 0,
      carbon_emission_kg: 0,
      carbon_emission_tons: 0,
      data_utilization: 0.017228,
      ip_address: '10.200.97.71',
      device_name: 'R_167_SW_02',
      device_id: 3338,
      site_name: 'SULAY',
      pn_code: 'X450a-24tdc',
      rack_name: 'L0-AF-13',
    },
    {
      time: '2025-08-03 18:00',
      input_kw: 0,
      output_kw: 0,
      traffic_consumed_gb: 0.0016,
      traffic_allocated_gb: 10,
      eer: 56,
      pue: 0,
      pcr: 0,
      throughput: 0,
      cost_estimation: 0,
      carbon_emission_kg: 0,
      carbon_emission_tons: 0,
      data_utilization: 0.016095,
      ip_address: '169.254.2.1',
      device_name: 'R_383',
      device_id: 3337,
      site_name: 'SULAY',
      pn_code: 'S5335-L24T4X-D1',
      rack_name: 'L0-AF-13',
    },
  ];

  const fetchDeviceDetails = async (siteId, duration) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        '/dashboard/get_metric_detail',
        {
          site_id: siteId,
          duration: duration,
        }
      );
      console.log('API Response::::', response.data);
      setLoading(false);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching device details:', error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (siteId && duration) {
      fetchDeviceDetails(siteId, duration)
        .then((res) => {
          setData(res);
          setFilteredData(res);
        })
        .catch((err) => {
          console.error('API Error:', err);
        });
    }
  }, [siteId, duration]);

  //   useEffect(() => {
  //     setData(testdata);
  //     setFilteredData(testdata);
  //   }, [testdata]);

  const handleSearch = (event) => {
    const { value } = event.target;
    if (value) {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: 'Device IP',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (text) => (
        <p
          style={{
            color: theme?.palette?.main_layout?.secondary_text,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: 'Model No',
      dataIndex: 'pn_code',
      key: 'pn_code',
    },
    {
      title: 'Date/Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Input Power (KW)',
      dataIndex: 'input_kw',
      key: 'input_kw',
    },
    {
      title: 'Output Power (KW)',
      dataIndex: 'output_kw',
      key: 'output_kw',
    },
    {
      title: 'Energy Efficiency Ratio',
      dataIndex: 'eer',
      key: 'eer',
      render: (_, record) => {
        const value = record.eer || 0;
        const max = 100;
        const percent = Math.min((value / max) * 100, 100);

        return (
          <CustomProgressWrapper type="up">
            <Progress percent={percent} size="small" showInfo={false} />
          </CustomProgressWrapper>
        );
      },
    },
    {
      title: 'CO2 Emissions (kg)',
      dataIndex: 'carbon_emission_kg',
      key: 'carbon_emission_kg',
    },
  ];

  return (
    <>
      <BackButton style={{ margin: '12px 0 10px 20px' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.main_layout?.primary_text,
          padding: '3px 10px',
          margin: '10px auto 0',
          width: '96%',
        }}
      >
        <p style={{ fontSize: '16px', fontWeight: 500 }}>Details</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>Results</span>
          <span
            style={{
              width: '27px',
              height: '27px',
              borderRadius: '100%',
              background: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.main_layout?.primary_text,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
            }}
          >
            {filteredData.length}
          </span>
        </div>
      </div>

      <DefaultCard
        sx={{
          width: `${width - 105}px`,
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: theme?.palette?.main_layout?.background,
            padding: '1px 10px 10px 10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <CustomInput
              nested="true"
              style={{ width: '300px' }}
              placeholder="Search..."
              onChange={handleSearch}
            />
            <ExportButton
              dataSource={filteredData}
              columns={columns}
              name="report"
            />
          </div>

          <CustomSpin spinning={loading}>
            <DefaultTable
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'even' : 'odd'
              }
              size="small"
              scroll={{ x: 1200 }}
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) =>
                record.device_id || record.ip_address || record.device_name
              }
              style={{ whiteSpace: 'pre' }}
              pagination={{
                defaultPageSize: 10,
                pageSizeOptions: [10, 50, data.length],
              }}
            />
          </CustomSpin>
        </div>
      </DefaultCard>
    </>
  );
};

export default DevicesDetailsTable;
