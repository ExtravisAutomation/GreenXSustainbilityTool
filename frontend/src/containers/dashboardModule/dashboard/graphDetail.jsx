import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables';
import { useNavigate } from 'react-router-dom';
// import Modal from "./modal";
import PdfModal from './modal';

import useWindowDimensions from '../../../hooks/useWindowDimensions';

import useColumnSearchProps from '../../../hooks/useColumnSearchProps';
import { Spin, Row, Col, Button, Modal } from 'antd';
import { dataKeysArray } from './constants';
import PageHeader from '../../../components/pageHeader';
import { SettingOutlined, ImportOutlined } from '@ant-design/icons';
import statusIcon from '../../../resources/svgs/status.png';
import downloadIcon from '../../../resources/svgs/download.png';
import {
  InboxOutlined,
  EyeOutlined,
  BackwardOutlined,
} from '@ant-design/icons';
import { Select, Space, DatePicker, Upload, message, Tooltip } from 'antd';
import ApcChart from '../../../components/apcChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKpiData } from '../../../store/features/dashboardModule/actions/kpiAction.js';
import { fetchMetricsData } from '../../../store/features/dashboardModule/actions/powerMetricSlice.js';
import { fetchTrafficData } from '../../../store/features/dashboardModule/actions/trafficThroughputClickAction.js';
import { useParams, useLocation } from 'react-router-dom';
import ExportButton from '../../../components/exportButton.jsx';
import BackButton from '../../../components/backButton.jsx';
import moment from 'moment';
import { Try } from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../utils/axios/index.js';
import { CustomInput } from '../../../components/customInput.jsx';
import axiosInstance from '../../../utils/axios/axiosInstance.js';
import {
  EerTooltipRender,
  PueTooltipRender,
} from './pages/devicePueDetail.jsx';
import CustomSpin from '../../../components/CustomSpin.jsx';
// const options = [
//   {
//     label: "Analysis Report",
//     value: "Analysis Report",
//     desc: "Analysis Report",
//   },
//   {
//     label: "Monitoring Report",
//     value: "Monitoring Report",
//     desc: "Monitoring Report",
//   },
//   {
//     label: "All",
//     value: "All",
//     desc: "All",
//   },
// ];

const { RangePicker } = DatePicker;
const StyledRangePicker = styled(RangePicker)`
  width: 100%;
  height: 40px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme }) => theme?.palette?.default_card?.border || '#d9d9d9'};
  background-color: ${({ theme }) =>
    theme?.palette?.default_select?.background || '#fff'};

  .ant-picker-input > input {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#000'};
  }

  .ant-picker-clear {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#999'};
  }

  .ant-picker-suffix {
    color: ${({ theme }) =>
      theme?.palette?.default_select?.primary_text || '#999'};
  }
  /* Directly target the inputs within the range picker */
  .ant-picker-input > date-range {
    color: ${({ theme }) =>
      theme?.palette?.main_layout?.primary_text} !important;
  }

  /* Apply styles to the range separator */
  .ant-picker-input > ant-picker-range-separator {
    color: ${({ theme }) =>
      theme?.palette?.main_layout?.primary_text} !important;
  }

  &:hover {
    border-color: ${({ theme }) =>
      theme?.palette?.default_select?.border || '#40a9ff'};
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#fff'};
  }

  .ant-picker-active-bar {
    background-color: ${({ theme }) =>
      theme?.palette?.default_select?.background || '#1890ff'};
  }
`;

const data = [];

const { Dragger } = Upload;
const GraphDetail = () => {
  const theme = useTheme();

  const { id } = useParams();
  const access_token = localStorage.getItem('access_token');

  // console.log(id, "ididid");
  // theme
  const navigate = useNavigate();
  // hooks
  const { height, width } = useWindowDimensions();
  // const getColumnSearchProps = useColumnSearchProps();
  const getColumnSearchProps = useColumnSearchProps();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // refs
  const location = useLocation();
  const { state } = location;
  // console.log(state, 'Data from graph derails');
  // Access the siteId from the state object
  const siteId = state ? state.siteId : null;
  // states
  const kpiData = useSelector((state) => state.kpi.data);
  // const kpiLoading = useSelector((state) => state.kpi.loading);
  const metricData = useSelector((state) => state.metrics.data);
  const trafficThroughputData = useSelector(
    (state) => state.trafficThroughPutDetail.data
  );

  const [fileList, setFileList] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // selectors
  // const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('All');
  // const siteId = useSelector((state) => state.siteId);
  // console.log(siteId, "siteId in detail");
  // const kpiData = useSelector((state) => state.kpi);
  // const isLoading = useSelector(
  //   (state) =>
  //     state.kpi.loading ||
  //     state.metrics.loading ||
  //     state.trafficThroughPutDetail.loading
  // );
  const isReduxLoading = useSelector(
    (state) =>
      state.kpi.loading ||
      state.metrics.loading ||
      state.trafficThroughPutDetail.loading
  );

  const isLoading = isReduxLoading || localLoading;

  const dispatch = useDispatch();

  const fetchDataIfNeeded = async () => {
    if (id == '1') {
      dispatch(fetchKpiData(siteId, state?.time, access_token));
    } else if (id == '2') {
      // try {
      //   const res = await axios.get(
      //     `${baseUrl}/sites/site/device_energy_details/${siteId}?device_id=${state?.device_id}&time=${state?.time}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${access_token}`,
      //       },
      //     }
      //   );
      //   console.log("rrrrrr", res);
      // } catch (error) {
      //   console.error("Error:", error);
      // }

      dispatch(
        fetchMetricsData(siteId, state?.device_id, state?.time, access_token)
      );
    } else if (id === '4' && !trafficThroughputData?.length) {
      dispatch(fetchTrafficData(siteId));
    } else {
      // dispatch(fetchKpiData(siteId, state?.time));
    }
  };
  useEffect(() => {
    fetchDataIfNeeded();
  }, [
    id,
    // siteId,
    dispatch,
    kpiData?.length,
    metricData?.length,
    trafficThroughputData?.length,
  ]);

  // let data;
  // if (id === "1") {
  //   setData(kpiData);
  // } else if (id === "2") {
  //   setData(metricData);
  // } else if (id === "4") {
  //   setData(trafficThroughputData);
  // }
  // working without loader
  // const fetchPue = async () => {
  //   try {
  //     const res = await axiosInstance.get(
  //       `/sites/sites/PUE_onclick/${siteId}?duration=${state?.time}`
  //     );
  //     if (res.status === 200) {
  //       setData(res?.data?.data);
  //     }
  //     // console.log("pue rrrrrr", res);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  // Updated fetchPue with local loader:
  const fetchPue = async () => {
    setLocalLoading(true);
    try {
      const res = await axiosInstance.get(
        `/sites/sites/PUE_onclick/${siteId}?duration=${state?.time}`
      );
      if (res.status === 200) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLocalLoading(false);
    }
  };
  // const fetchPueDevice = async () => {
  //   // console.log('state?.device_id', state?.device_id);

  //   try {
  //     const res = await axiosInstance.get(
  //       `/sites/sites/PUE_onclick/${siteId}?device_id=${state?.device_id}&duration=${state?.time}`
  //     );
  //     if (res.status === 200) {
  //       // console.log("pue devices...", res);

  //       setData(res?.data?.data);
  //     }
  //     console.log('pue rrrrrr', res);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  const fetchPueDevice = async () => {
    setLocalLoading(true);
    try {
      const res = await axiosInstance.get(
        `/sites/sites/PUE_onclick/${siteId}?device_id=${state?.device_id}&duration=${state?.time}`
      );
      if (res.status === 200) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (id == '1') {
      setData(kpiData);
    } else if (id == '2' && metricData?.length > 0) {
      console.log('abc data...', metricData);
      setData(metricData);
    } else if (id == '3') {
      fetchPue();
    } else if (id == '4') {
      setData(trafficThroughputData);
    } else if (id == '5') {
      fetchPueDevice();
    }
  }, [id, kpiData, metricData, trafficThroughputData]);
  const color = theme?.palette?.default_card?.background;
  const columns = [
    {
      title: 'Device IP',
      dataIndex: 'ip_address',
      key: 'ip_address',
      // sorter: (a, b) =>
      //   a.apic_controller_ip.localeCompare(b.apic_controller_ip),
      // ...getColumnSearchProps("apic_controller_ip"),
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      // sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      // ...getColumnSearchProps("device_name"),
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
      // render: (time) => moment(time).format("YYYY-MM-DD HH:MM:SS"),
      // ...getColumnSearchProps("time"),
    },
    {
      title: 'Input Power (KW)',
      dataIndex: 'total_PIn',
      key: 'total_PIn',
      // ...getColumnSearchProps("total_PIn"),
    },
    {
      title: 'Output Power (KW)',
      dataIndex: 'total_POut',
      key: 'total_POut',
      // ...getColumnSearchProps("total_POut"),
    },
    // {
    //   title:
    //     id == '3' || id == '5'
    //       ? 'Power Usage Effectiveness'
    //       : 'Energy Efficiency Ratio',
    //   dataIndex: id == '3' || id == '5' ? 'pue' : 'eer',
    //   key: id == '3' || id == '5' ? 'pue' : 'eer',
    //   // ...getColumnSearchProps("eer"),
    //   render: (record, text) => (
    //     <Tooltip
    //       placement="left"
    //       color={color}
    //       overlayInnerStyle={{
    //         backgroundColor: theme?.palette?.graph?.toolTip_bg,
    //         color: theme?.palette?.main_layout?.primary_text,
    //       }}
    //       overlayStyle={{
    //         border: `1px solid ${theme?.palette?.default_card?.border}`,
    //       }}
    //       key={color}
    //       title={
    //         (record <= 50 && id == '3') || id == '5'
    //           ? 'Low PUE values indicate efficient power usage'
    //           : record <= 0.5
    //             ? 'Low EER values indicate poor efficiency.'
    //             : (record >= 85 && id == '3') || id == '5'
    //               ? 'High PUE values signify poor power usage.'
    //               : record > 1
    //                 ? 'High EER values signify excellent efficiency.'
    //                 : record < 85 || (record > 50 && id == '3') || id == '5'
    //                   ? 'Average PUE values suggest moderate power usage.'
    //                   : record > 0.5 || record < 1
    //                     ? 'Average EER values suggest moderate efficiency.'
    //                     : ''
    //       }
    //     >
    //       <p
    //         style={{
    //           color:
    //             (record > 1 && id == '3') || id == '5'
    //               ? 'green'
    //               : record < 0.5
    //                 ? 'red'
    //                 : record > 0.5 && record < 1
    //                   ? 'blue'
    //                   : id == '3' || id == '5'
    //                     ? 'red'
    //                     : 'green',
    //         }}
    //       >
    //         {record}
    //       </p>
    //     </Tooltip>
    //   ),
    // },
    // {
    //   title: 'Power Usage Effectiveness',
    //   dataIndex: 'pue',
    //   key: 'pue',
    //   render: PueTooltipRender,
    //   // ...getColumnSearchProps("pue"),
    // },
    {
      title: 'Energy Efficiency Ratio ',
      dataIndex: 'eer',
      key: 'eer',
      // ...getColumnSearchProps("co2e"),
    },
    {
      title: 'CO2 Emissions (kg)',
      dataIndex: 'co2e',
      key: 'co2e',
      // ...getColumnSearchProps("co2e"),
    },
  ];
  const columns3 = [
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      // sorter: (a, b) => a.device_name.localeCompare(b.device_name),
      // ...getColumnSearchProps("device_name"),
    },
    {
      title: 'Device IP',
      dataIndex: 'apic_controller_ip',
      key: 'apic_controller_ip',
      // sorter: (a, b) =>
      //   a.apic_controller_ip.localeCompare(b.apic_controller_ip),
      // ...getColumnSearchProps("apic_controller_ip"),
    },
    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
      // sorter: (a, b) => a.site_name.localeCompare(b.site_name),
      // ...getColumnSearchProps("site_name"),
    },
    // {
    //   title: "Rack Name",
    //   dataIndex: "rack_name",
    //   key: "rack_name",
    //   sorter: (a, b) => a.rack_name.localeCompare(b.rack_name),
    //   ...getColumnSearchProps("rack_name"),
    // },
    {
      title: 'Model Number',
      dataIndex: 'pn_code',
      key: 'pn_code',
      // sorter: (a, b) => a.pn_code.localeCompare(b.pn_code),
      // ...getColumnSearchProps("pn_code"),
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      // sorter: (a, b) => a.serial_number.localeCompare(b.serial_number),
      // ...getColumnSearchProps("serial_number"),
    },
    {
      title: 'Date/Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => moment(time).format('YYYY-MM-DD HH:MM:SS'),
    },
    {
      title: 'Power Efficiency (%)',
      dataIndex: 'PE',
      key: 'PE',
      // ...getColumnSearchProps("PE"),
      render: (record, text) => (
        // <Tooltip
        //   placement="left"
        //   color={color}
        //   key={color}
        //   title={
        //     record < 50
        //       ? "PUE (Power Usage Effectiveness) measures data center energy efficiency; a lower PUE indicates a greener facility"
        //       : record >= 85
        //       ? "PUE measures data center energy efficiency; a higher value signals lower efficiency, indicating the need for greener improvements."
        //       : "PUE measures data center energy efficiency; medium PUE signifies moderate energy efficiency, indicating room for further green enhancements."
        //   }
        // >
        <p
          style={{
            color:
              record < 50
                ? 'green'
                : record > 50 && record < 85
                  ? 'blue'
                  : 'red',
          }}
        >
          {parseFloat(record).toFixed(2)}
        </p>
        // </Tooltip>
      ),
      // sorter: (a, b) => a?.PE.localeCompare(b?.PE),
    },
    {
      title: 'Energy Consumption (W)',
      dataIndex: 'current_power',
      key: 'current_power',
      // sorter: (a, b) => a?.current_power.localeCompare(b?.current_power),
      // ...getColumnSearchProps("current_power"),
    },
    {
      title: 'Traffic Throughput (GB)',
      dataIndex: 'traffic_throughput',
      key: 'traffic_throughput',
      // sorter: (a, b) => a?.traffic_throughput.localeCompare(b?.traffic_throughput),
      // ...getColumnSearchProps("traffic_throughput"),
    },
    // {
    //   title: "Hardware Version",
    //   dataIndex: "hardware_version",
    //   key: "hardware_version",
    //   sorter: (a, b) => a.hardware_version.localeCompare(b.hardware_version),
    //   ...getColumnSearchProps("hardware_version"),
    // },
    // {
    //   title: "Manufacturer",
    //   dataIndex: "manufacturer",
    //   key: "manufacturer",
    //   sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
    //   ...getColumnSearchProps("manufacturer"),
    // },

    // {
    //   title: "Software Version",
    //   dataIndex: "software_version",
    //   key: "software_version",
    //   sorter: (a, b) => a.software_version.localeCompare(b.software_version),
    //   ...getColumnSearchProps("software_version"),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (record) => (
    //     <div
    //       style={{
    //         background: record == "Inactive" ? "#D21E164A" : "#71B62633",
    //         color: record == "Inactive" ? "#D21E16" : "#C8FF8C",
    //         // opacity: "15%",
    //         borderRadius: "30px",
    //         padding: "1px 5px",
    //         textAlign: "center",
    //         marginRight: "10px",
    //       }}
    //     >
    //       {record}
    //     </div>
    //   ),
    // },

    // {
    //   title: "PUE",
    //   dataIndex: "PUE",
    //   key: "PUE",
    //   sorter: (a, b) => a.PUE.localeCompare(b.PUE),
    //   ...getColumnSearchProps("PUE"),
    // },
  ];

  const buttons = [
    {
      type: 'Export',
      icon: <Icon fontSize="16px" icon="fe:export" />,
    },
    {
      type: 'Import',
      icon: <ImportOutlined />,
    },
  ];

  const handleChangeDateRange = (dates) => {
    const [startDate, endDate] = dates;
    const formattedStartDate = startDate.toISOString().substring(0, 10);
    const formattedEndDate = endDate.toISOString().substring(0, 10);
    console.log(formattedStartDate, 'start date');
    console.log(formattedEndDate, 'end date');
    const filtered = data.filter(
      (item) => item.time >= formattedStartDate && item.time <= formattedEndDate
    );
    setData(filtered);
  };

  useEffect(() => {
    const originalTime = state?.time;
    const formattedTime = moment(originalTime, 'YYYY-MM-DD HH:mm').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    if (state.time) {
      const filteredData = kpiData?.filter(
        (data) => data.time === formattedTime
      );

      setData(filteredData);
      console.log(filteredData, 'filteredData');
    }
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;

    if (value) {
      const filteredData = data?.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(data);
    }
  };
  return (
    <>
      <BackButton
        style={{ marginLeft: '20px', marginTop: '12px', marginBottom: '10px' }}
      ></BackButton>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.main_layout?.primary_text,
          padding: '3px 10px',
          marginTop: '10px',
          width: '96%',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            color: theme?.palette?.main_layout?.primary_text,
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Details
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>Resultes</span>
          <span
            style={{
              width: '27px',
              height: '27px',
              borderRadius: '100%',
              background: theme?.palette?.drop_down_button?.add_background,
              // color: theme?.palette?.drop_down_button?.add_text,
              color: theme?.palette?.main_layout?.primary_text,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
            }}
          >
            {filteredData.length > 0
              ? filteredData.length
              : data
                ? data?.length
                : ''}
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
              style={{
                width: '300px',
              }}
              placeholder="Search..."
              onChange={handleSearch}
            />
            {/* <div style={{ width: "50%" }}>
              <StyledRangePicker
                theme={theme}
                onChange={handleChangeDateRange}
              />
            </div> */}
            {/* <ExportButton
              dataSource={kpiData}
              columns={id === '4' ? columns3 : columns}
              name="report"
            /> */}
            <ExportButton
              dataSource={filteredData?.length > 0 ? filteredData : data}
              columns={id === '4' ? columns3 : columns}
              name="report"
            />
          </div>

          {/* <Row style={{ marginBottom: "20px" }}>
              <Col xs={24} sm={12} style={{ padding: "12px 0px 10px 10px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#B9B9B9",
                    marginBottom: "7px",
                    marginTop: "0px",
                  }}
                >
                  Select Date
                </p>
                <DatePicker.RangePicker />
              </Col>
              <Col xs={24} sm={12} style={{ padding: "0px 0px 10px 10px" }}>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#B9B9B9",
                    marginBottom: "7px",
                  }}
                >
                  Report Type
                </p>
                <Select
                  // mode="multiple"
                  className="custom_selector"
                  style={{
                    width: "100%",
                  }}
                  placeholder="select one country"
                  defaultValue={["All"]}
                  value={selectedOption}
                  onChange={handleChange}
                  optionLabelProp="label"
                  options={options}
                  optionRender={(option) => (
                    <Space>
                      <span role="img" aria-label={option.data.label}>
                        {option.data.emoji}
                      </span>
                      {option.data.desc}
                    </Space>
                  )}
                />
              </Col>
            </Row> */}

          <CustomSpin spinning={isLoading}>
            <DefaultTable
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'even' : 'odd'
              }
              size="small"
              scroll={{ x: 1200 }}
              // onChange={handleChange}
              columns={
                id == '1' || id == '2' || id == '3' || id == '5'
                  ? columns
                  : id === '4'
                    ? columns3
                    : null
              }
              // dataSource={data}
              dataSource={filteredData?.length > 0 ? filteredData : data}
              rowKey="name"
              style={{ whiteSpace: 'pre' }}
              pagination={{
                defaultPageSize: 10,
                pageSizeOptions: [10, 50, data?.length],
              }}
            />
          </CustomSpin>
        </div>
      </DefaultCard>
    </>
  );
};

export default GraphDetail;
