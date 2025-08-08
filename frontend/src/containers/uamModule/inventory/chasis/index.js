import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../../components/cards';
import DefaultTable from '../../../../components/tables';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { baseUrl, BaseUrl } from '../../../../utils/axios';
import { Spin } from 'antd';
import axios from 'axios';
import useColumnSearchProps from '../../../../hooks/useColumnSearchProps';
import ExportButton from '../../../../components/exportButton';
import { CustomInput } from '../../../../components/customInput';
import { fetchChassisDevices } from '../../../../services/devicesServices';
import CustomSpin from '../../../../components/CustomSpin';
const Chasis = () => {
  const access_token = localStorage.getItem('access_token');
  const theme = useTheme();
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState();
  const [chasessData, setChassesData] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };
  const columns = [
    {
      title: 'Device Model',
      dataIndex: 'devices_model',
      key: 'devices_model',
      // sorter: (a, b) => a.devices_model?.localeCompare(b.devices_model),
      // ...getColumnSearchProps("devices_model"),
    },
    {
      title: 'Device Slot',
      dataIndex: 'device_slot',
      key: 'device_slot',
      // sorter: (a, b) => a.device_slot?.localeCompare(b.device_slot),
      // ...getColumnSearchProps("device_slot"),

      render: (text) => (text === null ? 'null' : ''),
    },
    {
      title: 'PSIRT Count',
      dataIndex: 'PSIRT_Count',
      key: 'PSIRT_Count',
      // sorter: (a, b) => a.PSIRT_Count?.localeCompare(b.PSIRT_Count),
      // ...getColumnSearchProps("PSIRT_Count"),
    },
    // {
    //   title: "Chassis ID",
    //   dataIndex: "chassis_id",
    //   key: "chassis_id",
    // },

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
  ];

  // const fetchChasses = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(baseUrl + "/device_inventory/chasis", {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     if (response) {
  //       setChassesData(response.data.data);
  //       // console.log(response, "chasses resp");

  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // };
  const getChasses = async () => {
    setLoading(true);
    try {
      const data = await fetchChassisDevices();
      setChassesData(data?.data || []);
    } catch (err) {
      console.error('Error fetching chassis devices:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getChasses();
  }, []);

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
      const filteredData = chasessData?.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(chasessData);
    }
  };
  return (
    <>
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
          Chasses Detail
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
              // color: theme?.palette?.default_card?.color,
              // backgroundColor: theme?.palette?.default_card?.background,
              // padding: "12px 0px 14px 15px",
              marginTop: '10px',
              // width: "96.5%",
              // margin: "0 auto",
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
                : chasessData
                  ? chasessData?.length
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
            marginBottom: '5px',
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
                  : chasessData
                    ? chasessData
                    : []
            }
            columns={columns}
            name="chasses"
          />
        </div>

        <CustomSpin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            //   rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData?.length > 0 ? filteredData : chasessData}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, chasessData?.length],
            }}
            rowSelection={rowSelection}
            scroll={{
              x: 2500,
            }}
          />
        </CustomSpin>
      </DefaultCard>
    </>
  );
};

export default Chasis;
