import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../../components/cards.jsx';
import DefaultTable from '../../../../components/tables.jsx';
import ExportButton from '../../../../components/exportButton.jsx';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../../../hooks/useWindowDimensions.js';
import useColumnSearchProps from '../../../../hooks/useColumnSearchProps.js';
import { Spin } from 'antd';
import { baseUrl } from '../../../../utils/axios/index.js';
import axios from 'axios';
import { CustomInput } from '../../../../components/customInput.jsx';
import { fetchSeeds } from '../../../../services/mainInventoryServices.js';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const Cisco = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const access_token = localStorage.getItem('access_token');
  const { width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  const [loading, setLoading] = useState(false);
  const [inventoryPageData, setInventoryPageData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);

  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  // const fetchSeeds = async () => {
  //   const access_token = localStorage.getItem("access_token");

  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       baseUrl + "/sites/devices/get_all_with_sntc",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );
  //     if (response) {
  //       setInventoryPageData(response?.data);
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //     setInventoryPageData([]);
  //   }
  // };
  const getSeeds = async () => {
    setLoading(true);
    try {
      const response = await fetchSeeds();
      setInventoryPageData(response);
    } catch (err) {
      console.error('Failed to load seeds:', err);
      setInventoryPageData([]); // Fallback empty array
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSeeds();
  }, []);

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  const columns = [
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      // sorter: (a, b) => a.device_name?.localeCompare(b.device_name),
      // ...getColumnSearchProps("device_name"),
      // render: (record) => {
      //   return <p style={{ cursor: 'pointer' }}>{record}</p>;
      // },
    },
    {
      title: 'Device Type',
      dataIndex: 'device_type',
      key: 'device_type',
      // sorter: (a, b) => a.device_type?.localeCompare(b.device_type),
      // ...getColumnSearchProps("device_type"),
    },
    {
      title: 'Device Family',
      dataIndex: 'device_family',
      key: 'device_family',
      // sorter: (a, b) => a.device_family?.localeCompare(b.device_family),
      // ...getColumnSearchProps("device_family"),
    },
    {
      title: 'Model Name',
      dataIndex: 'model_name',
      key: 'model_name',
      // sorter: (a, b) => a.model_name?.localeCompare(b.model_name),
      // ...getColumnSearchProps("model_name"),
    },
    {
      title: 'Software Version',
      dataIndex: 'software_version',
      key: 'software_version',
      // sorter: (a, b) => a.software_version?.localeCompare(b.software_version),
      // ...getColumnSearchProps("software_version"),
    },

    {
      title: 'End of Life External Announcement',
      dataIndex: 'hw_eol_ad',
      key: 'hw_eol_ad',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_eol_ad?.localeCompare(b.hw_eol_ad),
      // ...getColumnSearchProps("hw_eol_ad"),
    },
    {
      title: 'End of Sale',
      dataIndex: 'hw_eos',
      key: 'hw_eos',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_eos?.localeCompare(b.hw_eos),
      // ...getColumnSearchProps("hw_eos"),
    },
    {
      title: 'End of Software Maintenance Release',
      dataIndex: 'sw_EoSWM',
      key: 'sw_EoSWM',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.sw_EoSWM?.localeCompare(b.sw_EoSWM),
      // ...getColumnSearchProps("sw_EoSWM"),
    },
    {
      title: 'End of Routine Failure Analysis',
      dataIndex: 'hw_EoRFA',
      key: 'hw_EoRFA',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_EoRFA?.localeCompare(b.hw_EoRFA),
      // ...getColumnSearchProps("hw_EoRFA"),
    },
    {
      title: 'End of Vulnerability/Security Support',
      dataIndex: 'sw_EoVSS',
      key: 'sw_EoVSS',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.sw_EoVSS?.localeCompare(b.sw_EoVSS),
      // ...getColumnSearchProps("sw_EoVSS"),
    },
    {
      title: 'End of Service Contract Renewal',
      dataIndex: 'hw_EoSCR',
      key: 'hw_EoSCR',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_EoSCR?.localeCompare(b.hw_EoSCR),
      // ...getColumnSearchProps("hw_EoSCR"),
    },
    {
      title: 'Last Date of Support',
      dataIndex: 'hw_ldos',
      key: 'hw_ldos',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_ldos?.localeCompare(b.hw_ldos),
      // ...getColumnSearchProps("hw_ldos"),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      // sorter: (a, b) => a.vendor?.localeCompare(b.vendor),
      // ...getColumnSearchProps("vendor"),
    },
  ];

  const rowSelection = {
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowsData(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (record, selected, selectedRows) => {},
  };

  const handleSearch = (event) => {
    const { value } = event.target;

    if (value) {
      const filteredData = inventoryPageData?.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(inventoryPageData);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: theme?.palette?.default_card?.color,
          backgroundColor: theme?.palette?.default_card?.background,
          width: '95.5%',
          padding: '4px 15px',
          margin: '0 auto',
          borderRadius: '6px',
        }}
      >
        <p
          style={{
            fontWeight: 500,
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          Cisco Details
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '10px',
            }}
          >
            <span>Resultes</span>
            <span
              style={{
                width: '27px',
                height: '27px',
                borderRadius: '100%',
                backgroundColor:
                  theme?.palette?.drop_down_button?.add_background,
                color: theme?.palette?.drop_down_button?.add_text,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
              }}
            >
              {filteredData.length > 0
                ? filteredData.length
                : inventoryPageData
                  ? inventoryPageData?.length
                  : ''}
            </span>
          </div>
        </div>
      </div>

      <DefaultCard sx={{ width: `${width - 105}px` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <CustomInput
            nested="true"
            style={{
              width: '300px',
            }}
            placeholder="Search..."
            onChange={handleSearch}
          />

          <ExportButton
            dataSource={
              selectedRowsData?.length > 0
                ? selectedRowsData
                : filteredData?.length > 0
                  ? filteredData
                  : inventoryPageData
                    ? inventoryPageData
                    : []
            }
            columns={columns}
            name="cisco"
          />
        </div>
        <CustomSpin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            columns={columns}
            dataSource={
              filteredData?.length > 0 ? filteredData : inventoryPageData
            }
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, inventoryPageData?.length],
            }}
            rowSelection={rowSelection}
            scroll={{
              x: 3000,
            }}
          />
        </CustomSpin>
      </DefaultCard>
    </div>
  );
};

export default Cisco;
