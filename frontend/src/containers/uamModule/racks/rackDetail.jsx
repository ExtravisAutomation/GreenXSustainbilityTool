import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import device from '../../../resources/svgs/deviceone.png';
import devicedetail from '../../../resources/svgs/device1.png';
import { useLocation } from 'react-router-dom';
import { Button, Progress, Row, Col } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BackwardOutlined } from '@ant-design/icons';
import EChartsGauge from '../inventory/guage';
import PowerUtilizationChart from '../inventory/powerUtilization';
import { baseUrl } from '../../../utils/axios';
import axios from 'axios';
import BackButton from '../../../components/backButton';
import { fetchHmRackDetail } from '../../../store/features/dashboardModule/actions/hmRackClickAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../../context/appContext';
import RackDetailCard from './rackComponents/RackDetailCard';
import styled from 'styled-components';
import {
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaTemperatureLow,
  FaListAlt,
  FaChartBar,
} from 'react-icons/fa';
import AlertsSection from './rackComponents/AlertsSection';
import { MdOutlineSevereCold, MdSevereCold } from 'react-icons/md';
import GaugeChart from '../../../components/GaugeChart';
// import DetailItem from './rackComponents/DetailItem';
import RackDetailsSection from './rackComponents/RackDetailsSecton';
import DefaultButton from '../../../components/buttons';
import { color } from 'echarts';
import {
  fetchPowerUtilization,
  getRackCo2emmission,
  getRackLastPowerUtilization,
} from '../../../services/rackServices';
function RackDetail() {
  const theme = useTheme();
  const access_token = localStorage.getItem('access_token');
  const dispatch = useDispatch();
  const [apicDataPerHour, setApicDataPerHour] = useState();
  const [guageData, setGuageData] = useState();
  const [isChartVisible, setIsChartVisible] = useState(false);
  const location = useLocation();
  console.log('location:', location);
  const rack_id = location?.state?.data?.id;
  const rack_site_id = location?.state?.data?.site_id;
  const [co2Emission, setCo2Emission] = useState([]);
  const { data } = location.state || {};
  const { isDarkMode, setDarkMode } = useContext(AppContext);

  // Guage charts
  const [showEnergyChart, setShowEnergyChart] = useState(false);
  const handleEnergyChart = () => setShowEnergyChart(!showEnergyChart);
  const [showCollingChart, setShowCollingChart] = useState(false);
  const handleCollingChart = () => setShowCollingChart(!showCollingChart);
  const [showTempChart, setShowTempChart] = useState(false);
  const handleTempChart = () => setShowTempChart(!showTempChart);
  const { id } = useParams();

  useEffect(() => {
    // console.log('rack id', rack_id);
    // console.log('rack site id', rack_site_id);

    dispatch(fetchHmRackDetail(rack_id, rack_site_id));
  }, [, rack_id, rack_site_id]);
  // useEffect(() => {
  //   if (location?.state?.rackId && location?.state?.siteId) {
  //     console.log('rack data', location?.state);
  //     dispatch(fetchHmRackDetail(location.state.rackId, location.state.siteId));
  //   }
  // }, [location?.state?.rackId, location?.state?.siteId]);
  const rackDetail = useSelector((state) => state.hmRackDetail?.data);

  console.log('rackDetail', rackDetail);

  function getProgressColor(percent) {
    if (percent >= 85) {
      return 'green'; // Red for high utilization (> 80%)
    } else if (percent > 50 < percent) {
      return '#0490E7'; // Blue for moderate utilization (50% - 80%)
    } else {
      return '#d91c07'; // Green for low utilization (<= 50%)
    }
  }

  function getProgressColor2(percent) {
    if (percent >= 85) {
      return '#d91c07'; // Red for high utilization (> 80%)
    } else if (percent > 50 < percent) {
      return '#0490E7'; // Blue for moderate utilization (50% - 80%)
    } else {
      return 'green'; // Green for low utilization (<= 50%)
    }
  }

  const navigate = useNavigate();

  const containerStyle = {
    position: 'relative',
    paddingRight: '150px',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '0',
    right: '20',
  };

  // Using Services file:
  const getPowerUtilization = async () => {
    console.log('services through');

    try {
      const rackId = data?.id || location?.state?.rackId;
      const result = await fetchPowerUtilization(rackId);
      setApicDataPerHour(result);
    } catch (error) {
      console.error('Failed to fetch power utilization:', error);
    }
  };

  // Old code direct call
  // const getPowerUtilization = async () => {
  //   const response = await axios.post(
  //     baseUrl +
  //       `/racks/rackPowerutilization?rack_id=${
  //         data?.id || location?.state?.rackId
  //       }`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     }
  //   );
  //   setApicDataPerHour(response.data);
  //   console.log('PU Rack', response.data);
  // };

  // old code

  // const Co2emmission = async () => {
  //   const res = await axios.post(
  //     baseUrl +
  //       `/sites/site_Co2emmission?site_id=${data?.id || location?.state?.rackId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     }
  //   );
  //   setCo2Emission(res.data);
  // };

  const Co2emmission = async () => {
    const siteId = data?.id || location?.state?.rackId;

    try {
      const res = await getRackCo2emmission(siteId);
      setCo2Emission(res.data);
    } catch (error) {
      console.error('Error fetching CO2 emission:', error);
      // You can show a toast, alert, or fallback here
    }
  };

  // Old api call
  // const rackLastPowerUtiization = async () => {
  //   // const payload = {
  //   //   rack_id: data?.id,
  //   // };

  //   const response = await axios.post(
  //     baseUrl +
  //       `/racks/rackLastPowerUtiization?rack_id=${
  //         data?.id || location?.state?.rackId
  //       }`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     }
  //   );
  //   // console.log(response, "guga response");

  //   setGuageData(response.data?.power_utilization);
  // };
  // using throgh service:
  const rackLastPowerUtiization = async () => {
    const rackId = data?.id || location?.state?.rackId;

    try {
      const result = await getRackLastPowerUtilization(rackId);
      // Assuming response is in result.power_utilization
      setGuageData(result?.power_utilization);
    } catch (error) {
      console.error('Failed to fetch rack last power utilization:', error);
      // Optional: show error message to the user
    }
  };

  useEffect(() => {
    getPowerUtilization();
    rackLastPowerUtiization();
    Co2emmission();
  }, []);

  const LabelledValue = ({ label, value, color }) => (
    <div
      style={{
        padding: '5px 0px',
        width: '100%',
        marginBottom: '0px',
      }}
    >
      <label
        style={{
          fontWeight: 400,
          fontSize: '12',
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
          height: '35px',
          borderRadius: '8px',
          background: theme?.palette?.default_card?.background,
          color: color ? '#0490E7' : theme?.palette?.main_layout?.primary_text,
          fontSize: '12px',
          fontWeight: 500,
          paddingLeft: '10px',
          marginBottom: '0px',
        }}
      >
        {value}
        {label == 'Data Traffic' ? ' Gb/s' : ''}
      </div>
    </div>
  );
  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    padding: 16px;
  `;
  const ToggleButton = styled.div`
    // background: #f0f0f0;
    border: none;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transition: background 0.2s;

    &:hover {
      // background: #e2e8f0;
      cursor: pointer;
    }
  `;
  const gaugeChartProps = {
    color: '#9619b5',
    trackColor: '#c8d3fd',
    size: 200,
    min: 0,
    max: 100,
  };
  const gaugeCollingChartProps = {
    color: '#00BFFF',
    trackColor: '#c8d3fd',
    size: 200,
    min: 0,
    max: 100,
  };
  const gaugeTempChartProps = {
    color: '#059669',
    trackColor: '#71B62633',
    size: 200,
    min: 0,
    max: 100,
  };
  // console.log("data?.pue", data?.pue);

  const handleChartButtonClick = function () {
    setIsChartVisible((prev) => !prev);
  };

  return (
    <>
      {/* <BackButton style={{ marginLeft: '14px' }}></BackButton> */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // width: '98.5%',
          margin: '0px 25px',
        }}
      >
        {/* <button
          onClick={() => {
            setIsChartVisible((prev) => !prev);
          }}
        >
          {isChartVisible ? 'SHow' : 'Hide'}
        </button> */}
        <ToggleButton
          onClick={handleChartButtonClick}
          style={{
            color: theme?.palette?.main_layout?.secondary_text,
            // background: theme?.mode == 'dark' ? 'transperant' : '#f0f0f0',
            background: theme?.palette?.default_card?.background,
          }}
        >
          {/* {isChartVisible ? <FaListAlt /> : <FaChartBar />} */}
          <FaListAlt
            style={{
              color: `${!isChartVisible ? theme?.palette?.main_layout?.secondary_text : theme?.palette?.main_layout?.primary_text}`,
            }}
          />{' '}
          <FaChartBar
            style={{
              color: `${isChartVisible ? theme?.palette?.main_layout?.secondary_text : theme?.palette?.main_layout?.primary_text}`,
            }}
          />
        </ToggleButton>
      </div>
      <div
        style={{
          color: '#e5e5e5',
          padding: '0px 10px 0 10px',
        }}
      >
        {/* card test */}
        {!isChartVisible ? (
          <GridContainer>
            <RackDetailCard
              title="Energy Efficiency"
              value={guageData ? guageData : 0}
              positive={true}
              icon={
                <FaChartLine
                  style={{
                    color: theme?.mode == 'dark' ? '#7c3aed' : '#7c3aed',
                    fontSize: 20,
                  }}
                />
              }
              bgColor={theme?.mode == 'dark' ? '#0f0b19' : '#ffffff'}
              textColor={theme?.mode == 'dark' ? '#7c3aed' : '#7c3aed'}
              titleText={theme?.mode == 'dark' ? '#E4E5E8' : '#374151'}
              handleClick={handleEnergyChart}
              showChart={showEnergyChart}
              chartProps={gaugeChartProps}
            />
            <RackDetailCard
              title="Cooling Power"
              // value="1,200"
              value={65}
              // change="-2.1%"
              positive={false}
              icon={
                <MdOutlineSevereCold
                  style={{
                    color: theme?.mode == 'dark' ? '#00BFFF' : '#2563eb',
                    fontSize: 20,
                  }}
                />
                // <FaUsers
                //   style={{ color: theme?.mode == 'dark' ? 'white' : '#2563eb' }}
                // />
              }
              bgColor={theme?.mode == 'dark' ? '#0f0b19' : '#ffffff'}
              // textColor="#2563eb"
              textColor={theme?.mode == 'dark' ? '#00BFFF' : '#2563eb'}
              titleText={theme?.mode == 'dark' ? '#E4E5E8' : '#374151'}
              handleClick={handleCollingChart}
              showChart={showCollingChart}
              chartProps={gaugeCollingChartProps}
            />

            <RackDetailCard
              title="Temperature"
              value={32.5}
              positive={true}
              icon={
                <FaTemperatureLow
                  style={{
                    color: theme?.mode == 'dark' ? '#059669' : '#059669',
                    fontSize: 20,
                  }}
                />
              }
              bgColor={theme?.mode == 'dark' ? '#0f0b19' : '#ffffff'}
              // textColor="#059669"

              textColor={theme?.mode == 'dark' ? '#059669' : '#059669'}
              titleText={theme?.mode == 'dark' ? '#E4E5E8' : '#374151'}
              handleClick={handleTempChart}
              showChart={showTempChart}
              chartProps={gaugeTempChartProps}
            />
          </GridContainer>
        ) : (
          <Row
            gutter={[16, 10]}
            style={{
              boxSizing: 'border-box',
              margin: '0px 0px 0px 0px ',
              // padding: '0 10px',
              padding: '16px',
            }}
          >
            <Col xs={24} lg={8} style={{ padding: '0px' }}>
              <div
                style={{
                  backgroundColor: theme?.palette?.default_card?.background,
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  borderRadius: '7px',
                  height: '300px',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme?.palette?.main_layout?.primary_text,
                    paddingLeft: '20px',
                  }}
                >
                  Rack Current Energy Efficiency (hourly)
                </p>

                <div
                  style={{
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: '35px',
                  }}
                >
                  <GaugeChart
                    value={guageData ? guageData : 0}
                    color="#5454be"
                    trackColor="#A7b6Fa"
                    size={250}
                    min={0}
                    max={100}
                    rackpage={true}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div
                style={{
                  backgroundColor: theme?.palette?.default_card?.background,
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  borderRadius: '7px',
                  height: '300px',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme?.palette?.main_layout?.primary_text,
                    paddingLeft: '20px',
                  }}
                >
                  Cooling Power Usage (hourly)
                </p>

                <div
                  style={{
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: '35px',
                  }}
                >
                  <GaugeChart
                    value={65}
                    color="#00BFFF"
                    trackColor="#c0dee5"
                    size={250}
                    min={0}
                    max={100}
                    rackpage={true}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div
                style={{
                  backgroundColor: theme?.palette?.default_card?.background,
                  border: `1px solid ${theme?.palette?.default_card?.border}`,
                  borderRadius: '7px',
                  height: '300px',
                }}
              >
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: theme?.palette?.main_layout?.primary_text,
                    paddingLeft: '20px',
                  }}
                >
                  Temperature Monitoring (hourly)
                </p>

                <div
                  style={{
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: '35px',
                  }}
                >
                  <GaugeChart
                    value={32.5}
                    color="#059669"
                    trackColor="#e2f5df"
                    size={250}
                    min={0}
                    max={100}
                    rackpage={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* card test end */}

        {/* rack detail table */}
        <Row gutter={18} style={{ padding: '0px 15px 0px 20px' }}>
          <Col xs={24} lg={14} style={{ padding: '0px' }}>
            <div
              style={{
                color: '#e5e5e5',
                fontSize: '15px',
                // height: "520px",
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '7px',
                // width: "100%",
                padding: '10px',
                height: '295px',
              }}
            >
              <div
                style={{
                  overflowY: 'auto',
                  // overflowX: "none",
                  height: '100%',
                  // width: "100%",
                  // padding: "0 5px 0 5px",
                }}
              >
                <Row>
                  <Col lg={24}>
                    <RackDetailsSection energy_effeciency={guageData} />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <div
              style={{
                color: '#e5e5e5',
                fontSize: '15px',
                // height: "520px",
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '7px',
                // width: "100%",
                padding: '10px',
              }}
            >
              <AlertsSection isDarkMode={isDarkMode} />
            </div>
          </Col>

          {/* <Col xs={24} xl={12} style={{ padding: "10px" }}>
            <div
              style={{
                // width: "30%",
                position: "relative",
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: "7px",
                padding: "20px",
              }}
            >
              <img src={device} width={250} height={496} />
            </div>
          </Col> */}
        </Row>
      </div>
      {/* <Row
        gutter={[10, 0]}
        style={{
          boxSizing: 'border-box',
          margin: '10px 10px 0px 5px ',
          padding: '0 10px',
        }}
      >
        <Col xs={24} lg={8}>
          <div
            style={{
              backgroundColor: theme?.palette?.default_card?.background,
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              borderRadius: '7px',
              height: '300px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: theme?.palette?.main_layout?.primary_text,
                paddingLeft: '20px',
              }}
            >
              Rack Current Energy Efficiency (hourly)
            </p>

            <div
              style={{
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // marginTop: '35px',
              }}
            >
              <GaugeChart
                value={guageData ? guageData : 0}
                color="#5454be"
                trackColor="#A7b6Fa"
                size={250}
                min={0}
                max={100}
                rackpage={false}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div
            style={{
              backgroundColor: theme?.palette?.default_card?.background,
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              borderRadius: '7px',
              height: '300px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: theme?.palette?.main_layout?.primary_text,
                paddingLeft: '20px',
              }}
            >
              Cooling Power Usage (hourly)
            </p>

            <div
              style={{
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // marginTop: '35px',
              }}
            >
              <GaugeChart
                value={65}
                color="#00BFFF"
                trackColor="#c0dee5"
                size={250}
                min={0}
                max={100}
                rackpage={true}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div
            style={{
              backgroundColor: theme?.palette?.default_card?.background,
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              borderRadius: '7px',
              height: '300px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: theme?.palette?.main_layout?.primary_text,
                paddingLeft: '20px',
              }}
            >
              Temperature Monitoring (hourly)
            </p>

            <div
              style={{
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // marginTop: '35px',
              }}
            >
              <GaugeChart
                value={32.5}
                color="#059669"
                trackColor="#e2f5df"
                size={250}
                min={0}
                max={100}
                rackpage={true}
              />
            </div>
          </div>
        </Col>
      </Row> */}

      <div
        style={{
          padding: '0 10px 0 10px',
          minHeight: 360,
        }}
      >
        <Row>
          <Col xs={24} style={{ padding: '10px' }}>
            <div
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '7px',
                height: '300px',
                paddingLeft: '10px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: theme?.palette?.main_layout?.primary_text,
                  paddingLeft: '6px',
                  marginBottom: '10px',
                }}
              >
                Racks Energy Efficiency (24hr)
              </p>
              <div
                style={{
                  padding: '0px',
                  width: '100%',
                  // overflow: 'hidden',
                }}
              >
                <PowerUtilizationChart
                  dataa={apicDataPerHour}
                  style={{
                    width: '100%', // <-- Ensure full width
                    height: '240px',
                    bottom: '9%',
                  }}
                />
                {/* <PowerUtilizationChart
                  dataa={apicDataPerHour}
                  style={{
                    margin: 'auto',
                    display: 'block',
                    maxWidth: '100%',
                    bottom: '9%',
                    height: '240px',
                  }}
                /> */}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default RackDetail;
