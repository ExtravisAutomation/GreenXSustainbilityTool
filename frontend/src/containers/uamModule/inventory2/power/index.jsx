import React, { useState, useEffect } from 'react';
import DefaultCard from '../../../../components/cards';
import DefaultTable from '../../../../components/tables';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { BaseUrl } from '../../../../utils/axios';
import { Spin } from 'antd';
import useColumnSearchProps from '../../../../hooks/useColumnSearchProps';
import ExportButton from '../../../../components/exportButton';
import axios from 'axios';
const Power = () => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState();
  const [powerSupplyData, setChassesData] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };
  const columns = [
    {
      title: 'Power Supply Name',
      dataIndex: 'power_supply_name',
      key: 'power_supply_name',
      sorter: (a, b) => a.power_supply_name?.localeCompare(b.power_supply_name),
      ...getColumnSearchProps('power_supply_name'),
    },
    {
      title: 'Chassis Name',
      dataIndex: 'chassis_name',
      key: 'chassis_name',
      sorter: (a, b) => a.chassis_name?.localeCompare(b.chassis_name),
      ...getColumnSearchProps('chassis_name'),
    },

    {
      title: 'Power Supply Slot',
      dataIndex: 'ps_slot',
      key: 'ps_slot',
      sorter: (a, b) => a.ps_slot?.localeCompare(b.ps_slot),
      ...getColumnSearchProps('ps_slot'),
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      sorter: (a, b) => a.serial_number?.localeCompare(b.serial_number),
      ...getColumnSearchProps('serial_number'),
    },
    {
      title: 'Hardware Version',
      dataIndex: 'hardware_version',
      key: 'hardware_version',
      // render: (text) => (text === null ? "null" : ""),
      sorter: (a, b) => a.hardware_version?.localeCompare(b.hardware_version),
      ...getColumnSearchProps('hardware_version'),
    },
    {
      title: 'Software Version',
      dataIndex: 'software_version',
      key: 'software_version',
      // render: (text) => (text === null ? "null" : ""),
      sorter: (a, b) => a.software_version?.localeCompare(b.software_version),
      ...getColumnSearchProps('software_version'),
    },
    {
      title: 'End of Life External Announcement',
      dataIndex: 'hw_eol_ad',
      key: 'hw_eol_ad',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.hw_eol_ad?.localeCompare(b.hw_eol_ad),
      ...getColumnSearchProps('hw_eol_ad'),
    },
    {
      title: 'End of Sale',
      dataIndex: 'hw_eos',
      key: 'hw_eos',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.hw_eos?.localeCompare(b.hw_eos),
      ...getColumnSearchProps('hw_eos'),
    },
    {
      title: 'End of Software Maintenance Release',
      dataIndex: 'sw_EoSWM',
      key: 'sw_EoSWM',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.sw_EoSWM?.localeCompare(b.sw_EoSWM),
      ...getColumnSearchProps('sw_EoSWM'),
    },
    {
      title: 'End of Routine Failure Analysis',
      dataIndex: 'hw_EoRFA',
      key: 'hw_EoRFA',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.hw_EoRFA?.localeCompare(b.hw_EoRFA),
      ...getColumnSearchProps('hw_EoRFA'),
    },
    {
      title: 'End of Vulnerability/Security Support',
      dataIndex: 'sw_EoVSS',
      key: 'sw_EoVSS',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.sw_EoVSS?.localeCompare(b.sw_EoVSS),
      ...getColumnSearchProps('sw_EoVSS'),
    },
    {
      title: 'End of Service Contract Renewal',
      dataIndex: 'hw_EoSCR',
      key: 'hw_EoSCR',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.hw_EoSCR?.localeCompare(b.hw_EoSCR),
      ...getColumnSearchProps('hw_EoSCR'),
    },
    {
      title: 'Last Date of Support',
      dataIndex: 'hw_ldos',
      key: 'hw_ldos',
      //   render: (text) => formatDateTime(text),
      sorter: (a, b) => a.hw_ldos?.localeCompare(b.hw_ldos),
      ...getColumnSearchProps('hw_ldos'),
    },
  ];

  const fetchPowerSupply = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        BaseUrl + '/device_inventory/powerSupply'
      );
      if (response) {
        setChassesData(response.data.data);
        // console.log(response, "chasses resp");

        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPowerSupply();
  }, []);
  return (
    <>
      <DefaultCard sx={{ width: `${width - 105}px` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            marginBottom: '5px',
          }}
        >
          <ExportButton
            dataSource={
              filteredData
                ? filteredData
                : powerSupplyData
                  ? powerSupplyData
                  : []
            }
            columns={columns}
            name="Power_Supply"
          />
        </div>
        <CustomSpin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            columns={columns}
            dataSource={powerSupplyData}
            onChange={handleChange}
            rowKey="name"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, powerSupplyData?.length],
            }}
            scroll={{
              x: 3000,
            }}
          />
        </CustomSpin>
      </DefaultCard>
    </>
  );
};

export default Power;
