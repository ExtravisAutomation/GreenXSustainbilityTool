import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import device from '../../../resources/svgs/device.png';
import devicedetail from '../../../resources/svgs/devicedetail.png';
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Progress,
  Button,
  Spin,
} from 'antd';
import { useLocation } from 'react-router-dom';
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PowerUtilizationChart from './powerUtilization';
import { PowerUtilizationChart1 } from './powerUtilization';

import { BackwardOutlined } from '@ant-design/icons';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { baseUrl } from '../../../utils/axios';
import { BaseUrl } from '../../../utils/axios';
import RuDevice from './ruDevice';
import Guage from './guage';
import EChartsGauge from './guage';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopDevicesClickData } from '../../../store/features/dashboardModule/actions/topDevicesClickAction';
import BackButton from '../../../components/backButton';
import CustomProgress from '../../../components/customProgress';
import CustomCard from '../../../components/customCard';
import ThreshholdAlerts from '../../../components/threshholdAlerts';
import { useTheme } from '@mui/material/styles';
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector';
import AnomaliesChart from '../../../components/anomaliesDetectionChart';
import { fetchTrafficThroughputChartData } from '../../../store/features/dashboardModule/actions/trafficThroughputAction';
import styled from 'styled-components';
import GaugeChart from '../../../components/GaugeChart';
import DevicesDetailsSection from './inventoryComponents/DevicesDetailsSection';
import { AppContext } from '../../../context/appContext';
import {
  fetchDevicePowerPerHour,
  fetchDevicePowerUtilization,
  fetchDeviceThreshold,
  fetchDeviceTrafficPerHour,
  fetchPueDevice,
} from '../../../services/devicesServices';
import CustomSpin from '../../../components/CustomSpin';
const durations = [
  {
    value: '24 hours',
    label: '24 hours',
  },
  {
    value: '7 Days',
    label: '7 Days',
  },

  {
    value: 'Last Month',
    label: 'Last Month',
  },
  {
    value: 'Current Month',
    label: 'Current Month',
  },
  { value: 'First Quarter', label: 'First Quarter' },
  { value: 'Second Quarter', label: 'Second Quarter' },
  { value: 'Third Quarter', label: 'Third Quarter' },
  {
    value: 'Last 3 Months',
    label: 'Last 3 Months',
  },
  {
    value: 'Last 6 Months',
    label: 'Last 6 Months',
  },
  {
    value: 'Last 9 Months',
    label: 'Last 9 Months',
  },
  {
    value: 'Last Year',
    label: 'Last Year',
  },
  {
    value: 'Current Year',
    label: 'Current Year',
  },
];

function InventoryDetail() {
  const theme = useTheme();
  const { isMenuVisible, setMenuVisible } = useContext(AppContext);

  const [apicData, setApicData] = useState();
  const [apicDataPerHour, setApicDataPerHour] = useState();
  const [throughput, setThroughput] = useState();
  const [threshholdData, setThreshholdData] = useState();
  const [pueData, setPueData] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  const { state } = location;

  const [duration, setDuration] = useState('24 hours');
  const [pueDuration, setPueDuration] = useState('24 hours');
  const [pueLoader, setPueLoader] = useState(false);
  const [eerLoader, setEerLoader] = useState(false);
  const ttLoader = useSelector(
    (state) => state.trafficThroughPutChartData.loading
  );
  const [throuputOption, setThrouputOption] = useState('24 hours');

  const access_token = localStorage.getItem('access_token');
  // console.log('siteData:::', state?.data?.device_name);

  const siteId = state?.data?.site_id;
  const siteName = state?.data?.site_name;
  const deviceName = state?.data?.device_name;
  const device_id = state?.data?.apic_controller_id
    ? state?.data?.apic_controller_id
    : state?.data?.id;

  // console.log('state data.....device id::::::', state);
  const device_ip = state?.data?.device_ip;

  // mycode:::::
  const parent = state?.parent;
  // console.log('Parent component:', parent);

  const onBoardData = state?.data;

  // console.log('Device Data___ip', device_ip);
  // console.log('Device Data___id', device_id);
  // console.log('Device Data:::::::', state?.data);

  const TopDevicesData = useSelector(
    (state) => state.topDevicesPowerCostClickData?.data?.data
  );
  // console.log('Top 5 Devices::::', TopDevicesData);

  const isLoading = useSelector(
    (state) => state.topDevicesPowerCostClickData?.loading
  );

  const containerStyle = {
    position: 'relative',
    paddingRight: '150px',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '0',
    right: '20',
  };

  // const getPueDevice = async () => {
  //   setPueLoader(true);
  //   if (siteId) {
  //     try {
  //       const response = await axios.get(
  //         baseUrl +
  //           `/sites/sites/average_energy_consumption_metrics/${siteId}?device_id=${device_id}&duration=${duration}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         }
  //       );
  //       if (response?.status === 200) {
  //         setPueData(response?.data?.data);
  //         setPueLoader(false);
  //       } else {
  //         setPueData([]);
  //         setPueLoader(false);
  //       }
  //     } catch (error) {
  //       setPueData([]);
  //       setPueLoader(false);

  //       console.error('Failed to fetch carbon emission data:', error);
  //     }
  //   }
  // };
  const getPueDevice = async () => {
    setPueLoader(true);

    if (!siteId) return;

    try {
      const data = await fetchPueDevice(siteId, device_id, duration);
      setPueData(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch carbon emission data:', error);
      setPueData([]);
    } finally {
      setPueLoader(false);
    }
  };

  // const fetchThreshhold = async () => {
  //   if (siteId) {
  //     setEerLoader(true);
  //     try {
  //       const response = await axios.get(
  //         baseUrl +
  //           `/sites/sites/single_device_energy_consumption/${siteId}/${device_id}?duration=${duration}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${access_token}`,
  //           },
  //         }
  //       );
  //       if (response?.status === 200) {
  //         setThreshholdData(response?.data?.data);
  //         setEerLoader(false);
  //       } else {
  //         setThreshholdData([]);
  //         setEerLoader(false);
  //       }
  //     } catch (error) {
  //       setThreshholdData([]);
  //       setEerLoader(false);
  //       console.error('Failed to fetch carbon emission data:', error);
  //     }
  //   }
  // };

  const getThreshhold = async () => {
    if (!siteId) return;

    setEerLoader(true);
    try {
      const data = await fetchDeviceThreshold(siteId, device_id, duration);
      setThreshholdData(data?.data || []);
    } catch (error) {
      console.error('Failed to fetch carbon emission data:', error);
      setThreshholdData([]);
    } finally {
      setEerLoader(false);
    }
  };

  // const deviceTraffic = async () => {
  //   const payload = {
  //     apic_controller_ip: data?.device_ip || state?.ip,
  //   };
  //   try {
  //     const res = await axios.post(baseUrl + `/devicetrafficperhr`, payload, {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     setThroughput(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const deviceTraffic = async () => {
    const controllerIp = data?.device_ip || state?.ip;
    if (!controllerIp) return;

    try {
      const result = await fetchDeviceTrafficPerHour(controllerIp);
      setThroughput(result);
    } catch (error) {
      console.error('Error fetching device traffic per hour:', error);
    }
  };

  // const ApicDataPerHour = async () => {
  //   const payload = {
  //     apic_controller_ip: data?.device_ip || state?.ip,
  //   };
  //   try {
  //     const response = await axios.post(
  //       baseUrl + `/devicePowerperhr`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );
  //     setApicDataPerHour(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const ApicDataPerHour = async () => {
    const controllerIp = data?.device_ip || state?.ip;
    if (!controllerIp) return;

    try {
      const result = await fetchDevicePowerPerHour(controllerIp);
      setApicDataPerHour(result);
    } catch (error) {
      console.error('Error fetching device power per hour:', error);
    }
  };

  // const getPowerUtilization = async () => {
  //   try {
  //     const res = await axios.post(
  //       baseUrl +
  //         `/device_inventory/deviceLastPowerUtiization?apic_api=${
  //           data?.device_ip || state?.ip
  //         }`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );

  //     setApicData(res.data);
  //   } catch (error) {}
  // };

  const getPowerUtilization = async () => {
    const controllerIp = data?.device_ip || state?.ip;
    if (!controllerIp) return;

    try {
      const result = await fetchDevicePowerUtilization(controllerIp);
      setApicData(result);
    } catch (error) {
      console.error('Error fetching power utilization:', error);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      setMenuVisible(false);
    }
    if (siteId && device_id) {
      getThreshhold();
    }
  }, [siteId, device_id, duration]);
  useEffect(() => {
    if (siteId && device_id) {
      getPueDevice();
    }
  }, [siteId, device_id, pueDuration]);

  useEffect(() => {
    // mycode we have to change
    dispatch(fetchTopDevicesClickData(device_ip));
    // console.log('deviceIp in UseeffectZ:::::', device_ip);

    // getPowerUtilization();
    // ApicDataPerHour();
    deviceTraffic();
  }, []);

  useEffect(() => {
    if (siteId && access_token) {
      dispatch(
        fetchTrafficThroughputChartData(
          siteId,
          data?.device_name,
          throuputOption,
          access_token
        )
      );
    }
  }, [siteId, throuputOption, access_token]);
  const trafficThroughputChartData = useSelector(
    (state) => state.trafficThroughPutChartData?.data?.data
  );
  const LabelledValue = ({ label, value, color }) => (
    <div
      style={{
        padding: '10px',
        width: '100%',
        marginBottom: '0px',
      }}
    >
      <label
        style={{
          fontWeight: 400,
          fontSize: '12px',
          color: theme?.palette?.main_layout?.primary_text,
        }}
      >
        {label}
      </label>
      <div
        style={{
          marginTop: '5px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '40px',
          borderRadius: '8px',
          // background: "#16212A",
          color: color ? '#0490E7' : theme?.palette?.main_layout?.primary_text,
          fontSize: '14px',
          fontWeight: 500,
          // paddingLeft: "10px",
          marginBottom: '0px',
        }}
      >
        {value}
        {label == 'Power Input' ? 'W' : label == 'Estimated Cost' ? 'AED' : ''}
      </div>
    </div>
  );
  const conicColors = {
    '0%': '#6DD4B1',
    '50%': '#4D71EC',
    '100%': '#6DD4B1',
  };
  const strokeColors = {
    '0%': '#29E5B8',
    '50%': '#074F84',
    '100%': '#29E5B8',
  };

  const StyledButton = styled.button`
    background: none;
    border: none;
    color: ${theme?.palette?.main_layout?.secondary_text};
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    width: 100px;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 10px 15px;
    border-radius: 9999px;
    transition: all 0.2s ease;
    margin-left: 10px;

    &:hover {
      background: ${theme?.name?.includes('Purple')
        ? 'linear-gradient(to right, #791b9c, #5454be)'
        : theme?.palette?.main_layout?.secondary_text};
      color: ${theme?.name?.includes('Purple')
        ? `${theme?.palette?.default_button?.primary_text}`
        : `${theme?.palette?.main_layout?.primary_text}`};
      outline: none;
    }
  `;
  return (
    <>
      {/* <BackButton
        style={{ marginLeft: '15px', margin: '10px 15px' }}
      ></BackButton> */}

      <div
        className="inventory_detail_container"
        style={{
          color: '#e5e5e5',
          fontSize: '15px',
          width: '94.3%',
          margin: '15px auto 0px',
          height: 'auto',
          borderRadius: '4px',
          padding: '10px 20px 10px 20px',
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.main_layout?.background,
        }}
      >
        {/* <div
          style={{
            height: '85%',
            padding: '0 5px 0 5px',
          }}
        > */}
        <Row>
          <Col lg={24}>
            <DevicesDetailsSection deviceData={onBoardData} />
          </Col>
        </Row>
        {/* <Row>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Device Name"
                value={TopDevicesData?.device_name}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
             
              <LabelledValue
                label="Device IP"
                value={
                  parent ? onBoardData?.device_ip : TopDevicesData?.device_ip
                }
                // value={TopDevicesData?.device_ip}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Device Serial Number"
                value={TopDevicesData?.serial_number}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Model Number"
                value={TopDevicesData?.pn_code}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Site Name"
                value={TopDevicesData?.site_name}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Rack Name"
                value={TopDevicesData?.rack_name}
              />
            </Col>
           
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Software Version"
                value={TopDevicesData?.software_version}
              />
            </Col>

           
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Life External Announcement"
                value={TopDevicesData?.hw_eol_ad}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Sale"
                value={TopDevicesData?.hw_eos}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Software Maintenance Release"
                value={TopDevicesData?.sw_EoSWM}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Routine Failure Analysis"
                value={TopDevicesData?.hw_EoRFA}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Vulnerability/Security Support"
                value={TopDevicesData?.sw_EoVSS}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="End of Service Contract Renewal"
                value={TopDevicesData?.hw_EoSCR}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Last Date of Support"
                value={TopDevicesData?.hw_ldos}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="HardwarecVersion"
                value={TopDevicesData?.hardware_version}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Manufacturer"
                value={TopDevicesData?.manufacturer}
              />
            </Col>

           
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: '0 10px 10px 10px' }}
              className="columns"
            >
              <LabelledValue
                label="Power Input"
                value={TopDevicesData?.power_input}
              />
            </Col>
           

            <Col
              xs={24}
              md={12}
              lg={6}
              style={{
                padding: '10px 0 0 10px',
              }}
            >
              <div
                style={{
                  marginBottom: '0px',
                  width: '100%',
                  paddingLeft: '10px',
                }}
              >
                <label
                  htmlFor=""
                  style={{
                    color: theme?.palette?.main_layout?.primary_text,
                  }}
                >
                  Energy Efficiency
                </label>

                <Progress
                  style={{ marginBottom: '0px', marginTop: '10px' }}
                  size={[250, 30]}
                  trailColor={theme?.palette?.graph?.trailColor}
                  strokeColor={
                    TopDevicesData?.power_utilization < 50
                      ? '#d91c07'
                      : TopDevicesData?.power_utilization > 50 &&
                          TopDevicesData?.power_utilization < 85
                        ? '#0490E7'
                        : '#4C791B'
                  }
                  percent={TopDevicesData?.power_utilization}
                  format={(percent) => (
                    <span style={{ color: '#B9B9B9' }}>{`${percent}%`}</span>
                  )}
                  status="active"
                  gapDegree={0}
                />
              </div>
            </Col>
          

            <Col
              xs={24}
              md={12}
              lg={4}
              style={{ padding: '10px 10px 10px 10px' }}
              className="columns"
            >
              <div style={{ paddingLeft: '10px' }}>
                <label
                  style={{
                    fontSize: '12px',
                    color: theme?.palette?.main_layout?.primary_text,
                  }}
                  htmlFor=""
                >
                  Status
                </label>
                <div
                  style={{
                    marginTop: '10px',
                    // background: "#71B62633",
                    background: theme?.palette?.status?.background,
                    color: theme?.palette?.status?.color,
                    width: '96px',
                    height: '30px',
                    borderRadius: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  {TopDevicesData?.status}
                </div>
              </div>
            </Col>
          </Row> */}
        {/* </div> */}
      </div>

      <div
        style={{
          color: '#e5e5e5',
          padding: '10px 10px 0 10px',
        }}
      >
        <Row>
          <Col xs={24} lg={12} style={{ padding: '10px' }}>
            <CustomSpin spinning={eerLoader}>
              <div
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '4px',
                  height: '277px',
                  paddingLeft: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        color: theme?.palette?.main_layout?.secondary_text,
                      }}
                    >
                      {state?.data?.device_name}{' '}
                    </span>
                    {/* Device Data Traffic (24hrs) */}
                    Energy Efficiency Ratio
                  </p>
                  <KpiSelector
                    options={durations}
                    setThreshholdOption={setDuration}
                    value={duration}
                    threshhold="true"
                  />
                </div>

                <ThreshholdAlerts
                  data={threshholdData}
                  siteId={siteId}
                  inventory={true}
                  siteName={siteName}
                  deviceName={deviceName}
                />
              </div>
            </CustomSpin>
          </Col>
          <Col xs={24} lg={12} style={{ padding: '10px' }}>
            <CustomSpin spinning={pueLoader}>
              <div
                style={{
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '4px',
                  height: '277px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: theme?.palette?.main_layout?.primary_text,
                      paddingLeft: '20px',
                      // marginBottom: "0px",
                    }}
                  >
                    <span
                      style={{
                        color: theme?.palette?.main_layout?.secondary_text,
                      }}
                    >
                      {state?.data?.device_name}{' '}
                    </span>
                    Power Usage Effectiveness
                  </p>
                  <KpiSelector
                    options={durations}
                    setPueOption2={setPueDuration}
                    value={pueDuration}
                    pueDevice="true"
                  />
                </div>

                {/* <EChartsGauge
                data={apicData ? apicData[0]?.power_utilization : 0}
              /> */}
                {/* <EChartsGauge
                  data={pueData && pueData?.power_efficiency}
                  inventory={true}
                /> */}
                {/* <GaugeChart /> */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <GaugeChart
                    // value={5}
                    value={pueData && pueData?.power_efficiency}
                    color={
                      theme?.name.includes('Purple') ? '#9619b5' : '#00BFFF'
                    }
                    // trackColor="#c8d3fd"
                    // trackColor="#44563c"
                    trackColor={
                      theme?.name?.includes('Green') ? '#71B62633' : '#c8d3fd'
                    }
                    size={250}
                  />
                </div>
                {/* <CustomProgress
                    pueValue={pueData?.power_efficiency}
                    pue="true"
                    type="circle"
                    strokeWidth="8"
                    size={[148]}
                    style={{}}
                  /> */}
              </div>
            </CustomSpin>
          </Col>
          <Col id="dataTraffic" xs={24} style={{ padding: '10px' }}>
            <CustomSpin spinning={ttLoader}>
              <CustomCard
                style={{
                  // border: "1px solid #36424E",
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  // backgroundColor: "#050C17",
                  backgroundColor: theme?.palette?.main_layout?.background,
                  borderRadius: '7px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'inter',
                    paddingBottom: '0px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: theme?.palette?.main_layout?.primary_text,
                      marginBottom: '0px',
                      marginTop: '0px',
                    }}
                  >
                    Energy Efficiency Trends Across Data Traffic
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      gap: '10px',
                    }}
                  >
                    <StyledButton
                    // onClick={() =>
                    //   // to be discussed with Saman
                    //   navigate(`graph-detail/4`, {
                    //     state: {
                    //       siteId: siteId,
                    //       time: duration,
                    //       device_id: device_id,
                    //     },
                    //   })
                    // }
                    // onClick={() => {
                    //   navigate('/#');
                    // }}
                    >
                      See Detail
                    </StyledButton>
                    <KpiSelector
                      options={durations}
                      setThrouputOption={setThrouputOption}
                      value={throuputOption}
                      throughPut="true"
                    />
                    {/* <DefaultSelector
                    options={updatedDevice}
                    onChange={dataTrafficChange}
                    value={dataTrafficDeviceName}
                  /> */}
                  </div>
                </div>

                {trafficThroughputChartData?.length > 0 ? (
                  <AnomaliesChart
                    data={trafficThroughputChartData}
                    dashboard={true}
                  />
                ) : (
                  <div
                    style={{
                      color: theme?.palette?.main_layout?.primary_text,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '247px',
                    }}
                  >
                    <p>No data</p>
                  </div>
                )}
              </CustomCard>
            </CustomSpin>
          </Col>
          {/* <Col xs={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                position: "relative",
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: "4px",
                padding: "20px 0 40px 100px",
                height: "478px",
              }}
            >
              <img src={device} width={210} height={500} />
            </div>
          </Col> */}
        </Row>
      </div>

      {/* <div
        style={{
          padding: "0 10px 0 10px",
          height: 360,
        }}
      >
        <Row>
          <Col xs={24} lg={24} style={{ padding: "10px" }}>
            <div
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: "4px",
                height: "300px",
                paddingLeft: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#E5E5E5",
                  paddingLeft: "7px",
                  marginBottom: "10px",
                }}
              >
                Device Energy Efficiency (24hrs)
              </p>
              <PowerUtilizationChart
                dataa={apicDataPerHour}
                style={{
                  margin: "auto",
                  display: "block",
                  maxWidth: "100%",
                  bottom: "9%",
                  height: "270px",
                }}
              />
            </div>
          </Col>
        </Row>
      </div> */}
    </>
  );
}

export default InventoryDetail;
