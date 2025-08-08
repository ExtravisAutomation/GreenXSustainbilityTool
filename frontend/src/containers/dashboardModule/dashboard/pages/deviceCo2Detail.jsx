import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axios/axiosInstance';
import TableWithResults from '../../../../components/ui/tablewithresult/tablewithResults';
import { fetchDeviceLevelAnalytics } from '../../../../services/dashboardServices/dashboardServices';

const DeviceCo2DetailPage = () => {
  const location = useLocation();
  const { siteId, device_id, duration } = location.state || {};
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceLevelAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetchDeviceLevelAnalytics(siteId, device_id);
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

export default DeviceCo2DetailPage;

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
    title: 'Carbon Emission',
    dataIndex: 'co2e',
    key: 'co2e',
  },
];
