import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios/axiosInstance';
import TableWithResults from '../../../../components/ui/tablewithresult/tablewithResults';
import { Tooltip } from 'antd';
import { useTheme } from '@mui/material/styles';
import { fetchDeviceLevelAnalytics } from '../../../../services/dashboardServices/dashboardServices';

const DevicePueDetailPage = () => {
  const location = useLocation();
  const { siteId, device_id, duration } = location.state || {};
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceLevelAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetchDeviceLevelAnalytics(
        siteId,
        device_id,
        duration
      );
      setData(response.data?.data);
      // setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching device level analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      getDeviceLevelAnalytics();
    }
  }, [siteId]);

  const handleSearch = (searchTerm) => {
    const filtered = data.filter((item) =>
      item.device_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <TableWithResults
      filteredData={filteredData}
      data={data}
      width={800} // Adjust width as needed
      handleSearch={handleSearch}
      kpiData={data}
      id="1" // Adjust id as needed
      columns={columns}
      isLoading={isLoading}
    />
  );
};

export default DevicePueDetailPage;

const columns = [
  {
    title: 'Device IP',
    dataIndex: 'ip_address',
    key: 'ip_address',
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Model No',
    dataIndex: 'model_no',
    key: 'model_no',
  },
  {
    title: 'Date/Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Input Power (KW)',
    dataIndex: 'total_PIn',
    key: 'total_PIn',
  },
  {
    title: 'Output Power (KW)',
    dataIndex: 'total_POut',
    key: 'total_POut',
  },
  {
    title: 'Data Traffi (GB)',
    dataIndex: 'datatraffic',
    key: 'datatraffic',
    render: (text) => (text / 1024).toFixed(2), // Convert MB to GB
  },
  {
    title: 'Energy Efficiency Ratio',
    dataIndex: 'eer',
    key: 'eer',
    render: EerTooltipRender,
  },
  {
    title: 'Power Usage Effectiveness',
    dataIndex: 'pue',
    key: 'pue',
    render: PueTooltipRender,
  },
  {
    title: 'Power Consumption Ratio',
    dataIndex: 'pcr',
    key: 'pcr',
  },
];

export function PueTooltipRender(record) {
  const theme = useTheme();
  const color = theme?.palette?.default_card?.background;
  return (
    <Tooltip
      placement="left"
      color={color}
      overlayInnerStyle={{
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        color: theme?.palette?.main_layout?.primary_text,
      }}
      overlayStyle={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
      }}
      key={color}
      title={
        record > 1.5
          ? 'High PUE values signify poor power usage.'
          : record < 0.5
            ? 'Low PUE values indicate efficient power usage'
            : record > 0.5 && record < 1.5
              ? 'Average PUE values suggest moderate power usage.'
              : ''
      }
    >
      <p
        style={{
          color:
            record > 1.5
              ? 'red'
              : record < 0.5
                ? 'green'
                : record > 0.5 && record < 1.5
                  ? 'blue'
                  : 'green',
        }}
      >
        {record}
      </p>
    </Tooltip>
  );
}

export function EerTooltipRender(record) {
  const theme = useTheme();
  const color = theme?.palette?.default_card?.background;
  return (
    <Tooltip
      placement="left"
      color={color}
      overlayInnerStyle={{
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        color: theme?.palette?.main_layout?.primary_text,
      }}
      overlayStyle={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
      }}
      key={color}
      title={
        record > 1
          ? 'High EER values signify efficient power usage.'
          : record < 0.5
            ? 'Low EER values indicate poor power usage'
            : record > 0.5 && record < 1
              ? 'Average EER values suggest moderate power usage.'
              : ''
      }
    >
      <p
        style={{
          color:
            record > 1
              ? 'green'
              : record < 0.5
                ? 'red'
                : record > 0.5 && record < 1
                  ? 'blue'
                  : 'green',
        }}
      >
        {record}
      </p>
    </Tooltip>
  );
}
