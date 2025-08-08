// SiteDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Button, Row, Col, Progress } from 'antd';
import BackButton from '../../../components/backButton';
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BackwardOutlined } from '@ant-design/icons';
import CustomCard from '../../../components/customCard';
import DefaultCard from '../../../components/cards';
import PowerUtilizationChart from '../inventory/powerUtilization';
import CustomProgress from '../../../components/customProgress';
// import axios from 'axios';
// import { baseUrl, BaseUrl } from '../../../utils/axios';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../../../context/appContext';
// import axiosInstance from '../../../utils/axios/axiosInstance';
import SiteDetailsSection from './siteDetailComponents/SiteDetailsSection';
import {
  fetchSiteEnergyEfficiency,
  fetchSitePowerRequired,
  getSiteCo2emmission,
  getSiteHourlyEER,
} from '../../../services/siteServices';

const SiteDetail = () => {
  const theme = useTheme();
  const access_token = localStorage.getItem('access_token');
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const [siteEarlyEnergyEfficiency, setSiteEarlyEnergyEfficiency] = useState(
    []
  );

  const [powerEfficiency, setPowerEfficiency] = useState([]);
  const [sitePowerRequire, setSitePowerRequire] = useState([]);
  const [co2Emission, setCo2Emission] = useState([]);
  const { isDarkMode, setDarkMode } = useContext(AppContext);
  // site ID
  const siteId = data?.id;
  const conicColors_power = {
    '0%': '#c4101e',
    '50%': '#2b548f',
    '100%': '#3CB371',
  };
  const conicColors_power_purple = {
    '0%': '#9619B5',

    '50%': '#7b52db',
    '100%': '#074f84',
  };
  const conicColors2 = {
    '0%': '#44B5BC',
    '100%': '#52AFE5',
  };
  function getProgressColor(percent) {
    if (percent > 85) {
      return '#5CA413';
    } else if (percent > 50) {
      return '#6495ED';
    } else {
      // return '#c4101e';
      return '#fb0200';
    }
  }
  function getProgressColor2(percent) {
    if (percent > 85) {
      // return ' #c4101e';
      return '#fb0200';
    } else if (percent > 50) {
      return '#6495ED';
    } else {
      return '#5CA413';
    }
  }

  // const Co2emmission = async () => {
  //   const res = await axios.post(
  //     baseUrl + `/sites/site_Co2emmission?site_id=${data.id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     }
  //   );
  //   setCo2Emission(res.data);
  // };
  const Co2emmission = async () => {
    try {
      const res = await getSiteCo2emmission(siteId);
      setCo2Emission(res);
      console.log('Site Co2 data:', res);
    } catch (error) {
      console.error('Error fetching CO2 emission:', error);
      // You can show a toast, alert, or fallback here
    }
  };
  // const getSwitchesPowerUtilization = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       baseUrl + `/sites/site_hourly_eer/${data.id}`
  //       // {
  //       //   headers: {
  //       //     Authorization: `Bearer ${access_token}`,
  //       //   },
  //       // }
  //     );
  //     setSiteEarlyEnergyEfficiency(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  const getSwitchesPowerUtilization = async () => {
    try {
      const response = await getSiteHourlyEER(siteId);
      setSiteEarlyEnergyEfficiency(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // name will be changed wrt API end point
  // const getSiteEnergyEfficiency = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       // baseUrl + `/sites/site/sitePowerEfficiency/${data.id}`,
  //       baseUrl + `/sites/siteEnergyEfficiency/${data.id}`
  //       // {
  //       //   headers: {
  //       //     Authorization: `Bearer ${access_token}`,
  //       //   },
  //       // }
  //     );
  //     setPowerEfficiency(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  const getSiteEnergyEfficiency = async () => {
    try {
      const response = await fetchSiteEnergyEfficiency(siteId);
      setPowerEfficiency(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // const getSitePowerRequired = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       baseUrl + `/sites/siteRequiredPower/${siteId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );
  //     setSitePowerRequire(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  const getSitePowerRequired = async () => {
    try {
      const response = await fetchSitePowerRequired(siteId);
      setSitePowerRequire(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getSwitchesPowerUtilization();

    getSiteEnergyEfficiency();
    getSitePowerRequired();
    Co2emmission();
  }, []);
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
          color: color ? '#0490E7' : theme?.palette?.default_card?.color,
          fontSize: '14px',
          fontWeight: 500,
          // paddingLeft: "10px",
          marginBottom: '0px',
        }}
      >
        {value}
        {label == 'Data Traffic' ? ' Gb/s' : ''}
      </div>
    </div>
  );
  return (
    <>
      {/* <BackButton
        style={{ marginLeft: '15px', marginBottom: '5px' }}
      ></BackButton> */}
      <div style={{ color: '#e5e5e5', padding: '5px 20px 20px 20px' }}>
        <div
          style={{
            backgroundColor: theme?.palette?.default_card?.background,
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            borderRadius: '4px',
          }}
        >
          {/* <div
            style={{
              height: '85%',
              padding: '10px 10px 10px 10px',
            }}
          >
            <Row>
              <Col xs={12} md={12} lg={4} style={{ padding: '10px 0px 0 0px' }}>
                <LabelledValue label="Site Name" value={data.site_name} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Region" value={data.region} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="City" value={data.city} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Total Racks" value={data.num_racks} />
              </Col>

              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Total Devices" value={data.num_devices} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Longitude" value={data.longitude} />
              </Col>

              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Latitude" value={data.latitude} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue label="Data Traffic" value={data.datatraffic} />
              </Col>
              <Col
                xs={12}
                md={12}
                lg={4}
                style={{ padding: '10px 10px 0 10px' }}
              >
                <LabelledValue
                  label="Power Input"
                  value={
                    <span
                      style={{
                        color: getProgressColor(data.power_utilization),
                      }}
                    >
                      {data.power_input} KW
                    </span>
                  }
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
                    paddingTop: '10px',
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
                    style={{ marginBottom: '0px', marginTop: '5px' }}
                    size={[250, 35]}
                    trailColor={theme?.palette?.graph?.trailColor}
                    strokeColor={getProgressColor(data.energy_efficiency)}
                    percent={data.energy_efficiency}
                    format={(percent) => (
                      <span
                        style={{ color: theme?.palette?.default_card?.color }}
                      >{`${percent}%`}</span>
                    )}
                    status="active"
                    gapDegree={0}
                  />
                </div>
              </Col>

              <Col xs={24} md={12} lg={4} style={{ padding: '15px 10px' }}>
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
                    {data.status}
                  </div>
                </div>
              </Col>
            </Row>
          </div> */}
          <Row>
            {' '}
            <Col lg={24}>
              {' '}
              <SiteDetailsSection />
            </Col>
          </Row>
        </div>
        <Row
          gutter={[14, 14]}
          style={{ padding: '10px 0px 10px 6px', boxSizing: 'border-box' }}
        >
          <Col
            xs={24}
            xl={14}
            style={{ padding: '0px 10px 0px 0px', boxSizing: 'border-box' }}
          >
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '4px',
                height: '380px',
                color: theme?.palette?.default_card?.color,
              }}
            >
              <p
                style={{
                  marginTop: '0px',
                  color: theme?.palette?.default_card?.color,

                  fontSize: '16px',
                }}
              >
                24-Hour Energy Efficiency Trend
              </p>
              {/* Actually Energy Efficiency */}
              <PowerUtilizationChart
                style={{
                  margin: 'auto',
                  display: 'block',
                  maxWidth: '100%',
                  bottom: '8%',
                  height: '290px',
                }}
                dataa={siteEarlyEnergyEfficiency}
              />
            </CustomCard>
          </Col>
          <Col
            xs={24}
            md={12}
            xl={10}
            style={{ padding: '0px 10px 0px 0px', boxSizing: 'border-box' }}
          >
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '4px',
                height: '380px',
              }}
              title="Power Supply Efficiency"
            >
              <p
                style={{
                  marginTop: '0px',
                  color: theme?.palette?.main_layout?.primary_text,
                  fontSize: '16px',
                }}
              >
                Current Top Energy-Efficient Devices
              </p>
              {powerEfficiency.length > 0 ? (
                <Row>
                  {powerEfficiency.map((data) => (
                    <Col
                      lg={12}
                      style={{
                        padding: '10px 3px 3px 3px',
                        textAlign: 'center',
                      }}
                    >
                      <CustomProgress
                        // percent={data.power_efficiency}
                        percent={data?.energy_efficiency}
                        name={data.device_name}
                        type="circle"
                        strokeWidth="10"
                        size={[96]}
                        style={{}}
                        conicColors={
                          theme?.name.includes('Purple')
                            ? conicColors_power_purple
                            : conicColors_power
                        }
                        // conicColors={conicColors_power}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div
                  style={{
                    height: '340px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <p
                    style={{
                      color: theme?.palette?.main_layout?.primary_text,
                    }}
                  >
                    No Data
                  </p>
                </div>
              )}
            </CustomCard>
          </Col>
          {/* <Col xs={24} md={12} xl={6} style={{ padding: "20px 0px 20px 10px" }}>
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: "4px",
                minHeight: "378px",
              }}
              title="Apic"
            >
              <div
                style={{
                  background: theme?.palette?.available_options?.card_bg,
                  fontSize: "12px",
                  padding: "10px",
                  width: "87%",
                  margin: "0 auto",
                  color: theme?.palette?.main_layout?.primary_text,
                  borderRadius: "4px",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    marginTop: "0px",
                    marginBottom: "0px",
                    color: theme?.palette?.main_layout?.primary_text, // Change title text color
                    fontSize: "16px",
                  }}
                >
                  Current CO,-eq emissions [ Hourly ]
                </p>
              </div>
              <Row>
                {co2Emission.map((data) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={12}
                    style={{ padding: "10px", textAlign: "center" }}
                  >
                    <div
                      style={{
                        background: isDarkMode
                          ? theme?.palette?.available_options?.card_bg
                          : theme?.palette?.status?.background,
                        width: "100%",
                        height: "100px",
                        borderRadius: "4px",
                        textAlign: "center",
                        // all: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: isDarkMode
                              ? theme?.palette?.main_layout?.primary_text
                              : theme?.palette?.status?.color,
                            fontSize: "16px",
                            fontWeight: 700,
                            marginTop: "0px",
                            marginBottom: "5px",
                          }}
                        >
                          {data.co2_emission}g
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: isDarkMode
                              ? theme?.palette?.main_layout?.primary_text
                              : theme?.palette?.status?.color,
                            marginTop: "0px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {data.apic_controller_name}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </CustomCard>
          </Col> */}
        </Row>

        <Row
          gutter={[14, 14]}
          style={{ padding: ' 0px', boxSizing: 'border-box' }}
        >
          <Col
            sm={8}
            lg={4}
            style={{ padding: '0px 10px 0px 0px', boxSizing: 'border-box' }}
          >
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  marginTop: '0px',
                  color: theme?.palette?.main_layout?.primary_text,
                  fontSize: '16px',
                }}
              >
                Sites Required Power
              </p>
              {sitePowerRequire?.length > 0 ? (
                sitePowerRequire.map((data) => (
                  <div style={{ padding: '0px 0px 0px 0px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: theme?.palette?.main_layout?.primary_text,
                        marginBottom: '0px',
                        marginTop: '23px',
                      }}
                    >
                      {data.device_name}
                    </p>
                    <p
                      style={{
                        marginTop: '0px',
                        fontSize: '22px',
                        // color: "#5CA413",
                        color: `${theme?.palette?.main_layout?.secondary_text}`,
                        fontWeight: 700,
                      }}
                    >
                      {data.total_power} w
                    </p>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    height: '273px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ color: 'white' }}>No Data</p>
                </div>
              )}
            </CustomCard>
          </Col>
          <Col
            sm={16}
            lg={12}
            style={{ padding: '0px 10px 0px 0px', boxSizing: 'border-box' }}
          >
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '4px',
              }}
              title="Input Power"
            >
              <p
                style={{
                  marginTop: '0px',
                  color: theme?.palette?.main_layout?.primary_text,
                  fontSize: '16px',
                }}
              >
                Sites Input Energy Efficiency
              </p>
              <Row>
                {sitePowerRequire?.length > 0 ? (
                  sitePowerRequire.map((data) => (
                    <Col xs={24} style={{ padding: '17px' }}>
                      <CustomProgress
                        // percent={data.PowerPercentage}
                        percent={data?.energy_efficiency}
                        // strokeWidth="15"
                        // size="100"
                        size={['100%', 14]}
                        style={{}}
                        conicColors={getProgressColor2(data.power_in_per)}
                      />
                    </Col>
                  ))
                ) : (
                  <div
                    style={{
                      height: '273px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ color: 'white' }}>No Data</p>
                  </div>
                )}
              </Row>
            </CustomCard>
          </Col>
          <Col
            xs={24}
            md={12}
            xl={8}
            style={{ padding: '0px 10px 0px 0px', boxSizing: 'border-box' }}
          >
            <CustomCard
              style={{
                backgroundColor: theme?.palette?.default_card?.background,
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                borderRadius: '4px',
                minHeight: '378px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // <-- this is key
                alignItems: 'stretch',
              }}
              title="Apic"
            >
              <div
                style={{
                  // background: theme?.palette?.available_options?.card_bg,
                  fontSize: '12px',
                  padding: '0px 10px 10px 10px',
                  width: '87%',
                  margin: '0 auto',
                  color: theme?.palette?.main_layout?.primary_text,
                  borderRadius: '4px',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                <p
                  style={{
                    marginTop: '0px',
                    marginBottom: '0px',
                    color: theme?.palette?.main_layout?.primary_text, // Change title text color
                    fontSize: '16px',
                    fontWeight: '400',
                  }}
                >
                  Current Top Devies CO2 Emissions
                </p>
              </div>
              <Row>
                {co2Emission?.map((data) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={12}
                    style={{ padding: '10px', textAlign: 'center' }}
                  >
                    <div
                      style={{
                        background: `${theme?.palette?.available_options?.card_bg}`,
                        // background: isDarkMode
                        //   ? theme?.palette?.available_options?.card_bg
                        //   : theme?.palette?.status?.background,
                        width: '100%',
                        height: '100px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        // all: "center",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            // color: isDarkMode
                            //   ? theme?.palette?.main_layout?.secondary_text
                            //   : theme?.palette?.status?.color,
                            color: theme?.palette?.main_layout?.secondary_text,
                            fontSize: '16px',
                            fontWeight: 700,
                            marginTop: '0px',
                            marginBottom: '5px',
                          }}
                        >
                          {data.co2_emission} Kg
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            // color: isDarkMode
                            //   ? theme?.palette?.main_layout?.primary_text
                            //   : theme?.palette?.status?.color,
                            color: theme?.palette?.main_layout?.secondary_text,
                            marginTop: '0px',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {data.device_name}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </CustomCard>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SiteDetail;
