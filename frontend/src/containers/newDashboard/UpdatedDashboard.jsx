import React, { useContext, useEffect, useState } from 'react';
import DefaultSelector from '../../components/defaultSelector';
import { fetchSiteNames } from '../../services/services';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../../context/appContext';
import KpiSelector from '../dashboardModule/dashboard/kpiSelector';
import styled from 'styled-components';
import { Col, Row, Tag, Tooltip } from 'antd';
import CustomCard from '../../components/customCard';
// import DeviceIcon from '../../resources/svgs/device_icon.svg';
// import { ReactComponent as DeviceIcon } from '../../resources/svgs/device_icon.svg';
// import { ReactComponent as DeviceIcon } from '../../resources/svgs/device_icon.svg';

import PowerStatistic from './components/PowerStatistic';
import EnergyEfficiencyChart from './components/EnergyEfficiencyChart';
import LegendRow from './components/LegendRow';
import { TbDeviceDesktop } from 'react-icons/tb';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import PowerUsageEffectivenessChart from './components/PowerUsageEffectivenessChart';
import Interfaces from './components/Interfaces';
import Co2MetricsChart from './components/Co2MetricsChart';
import { fetchDeviceCo2Pcr, fetchMetricsData } from './services/Services';
import CustomSpin from '../../components/CustomSpin';
import Co2EmissionSection from './components/Co2EmissionSection';
import AntdTooltipContent from './components/AntdTooltipContent';
import { fetchElectricityMapPiData } from '../../store/features/dashboardModule/actions/electricityMapPi';
import CardsSection from './components/CardsSection';
import SiteEnergyEfficiencyRatio from '../dashboardModule/dashboard/components/siteEnergyEfficiencyRatio';
import EnergyTraficChart from './components/EnergyTraficChart';
import TopFiveDevicesTabla from './components/TopFiveDevicesTable';
import TopFiveDevicesTable from './components/TopFiveDevicesTable';
import HeatMapRacks from '../dashboardModule/dashboard/components/heatMapRacks';
import HardwareLifeCycle from '../dashboardModule/dashboard/components/hardwareLifeCycle';
import { fetchPiChartData } from '../../store/features/dashboardModule/actions/piChartAction';
import { fetchRacksAsync } from '../../store/features/uamModule/racks/slices/racksSlice';
import { fetchEnergyTrends } from '../../store/features/newDashboard/actions/energyTrafficTrendsActions';
import { fetchTopFiveDevices } from '../../store/features/newDashboard/actions/topFiveDevicesActions';
import DeviceCo2PowerCompareChart from './components/DeviceCo2PowerCompareChart';
import { fetchDevicesData } from '../../store/features/dashboardModule/actions/devicesAction';
import { fetchCo2PcrDevicesData } from '../../store/features/newDashboard/actions/Co2PcrDevicesDataActions';
import TopFiveDevicesSection from './components/TopFiveDevicesSection';
import DetailCards from '../dashboardModule/dashboard/detailCards';
import DetailCardsSection from './components/DetailCardsSection';
import CostBreakDownChart from './components/CostBreakDownChart';
import DevicesHeatMap from './components/DevicesHeatMap';
import { useNavigate } from 'react-router-dom';

const LabeledInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .label {
    font-size: 13px;
    font-weight: 500;
    padding-left: 2px;
    color: #7f7f7f;
  }

  .input-wrapper {
    // border: 1px solid ${({ theme }) =>
      theme?.palette?.default_input?.border} !important;

    border-radius: 6px;

    background-color: transparent;
  }

  .input-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
  }

  .selector-wrapper {
    position: relative;
    flex-shrink: 0;
  }
`;
const ChartTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  margin: 0;
  letter-spacing: 1px;
  color: ${({ theme }) => theme?.palette?.graph?.title};
`;
const TabButton = styled.button`
  flex: 1;
  height: 54px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #0f1620;
  color: ${({ theme }) => theme?.palette?.available_options?.primary_text};
  transition: none !important;
  box-shadow: none !important;
  outline: none !important;
  font-size: 14px;
  cursor: pointer;
`;

const kpiOptions = [
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

function UpdatedDashboard() {
  const access_token = localStorage.getItem('access_token');
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contextSite, setContextSite } = useContext(AppContext);
  // States
  const [siteName, setSiteName] = useState(null);
  const [sites, setSites] = useState();
  const [siteId, setSiteId] = useState(null);
  const [duration, setDuration] = useState('24 hours');
  const [loading, setLoading] = useState(false);
  const [metricsData, setMetricsData] = useState(null);
  const [co2pcrChartData, setCo2PcrChartData] = useState(null);
  const [deviceOneID, setDeviceOneId] = useState(null);
  const [deviceTwoID, setDeviceTwoId] = useState(null);
  const [activeView, setActiveView] = useState('eer');
  // data from redux store
  const electricityMapPiData = useSelector(
    (state) => state.electricityMapPiData
  );
  const {
    data: energyData,
    loading: energyTrendsLoading,
    error: energyTrendsError,
  } = useSelector((state) => state.energyTrends);

  // const {
  //   data: topFiveDevicesData = {}, // default to empty object to avoid destructuring error
  //   loading: topFiveDevicesLoading,
  //   error: topFiveDevicesError,
  // } = useSelector((state) => state.topFiveDevices);
  // co2PcrDevices
  const {
    data: co2PcrDevicesData = {},
    loading: co2PcrDevicesLoading,
    error: co2PcrDevicesError,
  } = useSelector((state) => state.co2PcrDevices);

  console.log('Devices data from Store in New Dashbaord:', co2PcrDevicesData);

  // const { top5_devices_by_carbonemmison = [], top5_devices_by_cost = [] } =
  //   topFiveDevicesData || {};
  // console.log('topFiveDevices Emission Data:', top5_devices_by_carbonemmison);

  const electricityMapData =
    electricityMapPiData?.data?.data?.consumption_percentages;

  //   funcitons
  const handleChange = (value) => {
    const selectedSite = sites.find((site) => site.value === value);
    if (selectedSite) {
      setContextSite({
        siteId: selectedSite.value,
        siteName: selectedSite.label,
      });
    }
  };
  const handleDurationChange = (value) => {
    // console.log('duration', value);
    setDuration(value); // ✅ Set duration as a string
  };

  //   API calls
  const siteNames = async () => {
    try {
      const sitesss = await fetchSiteNames();
      setSites(
        sitesss?.map((item) => {
          return {
            label: item?.site_name,
            value: item?.id,
          };
        })
      );
    } catch (error) {
      // console.log(' error', error);
    }
  };
  const getMetrics = async () => {
    setLoading(true);
    // setError(null);

    try {
      const response = await fetchMetricsData(siteId, duration);
      setMetricsData(response?.data?.data);
      // console.log('Metrics Data', response?.data?.data);
    } catch (err) {
      //   setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const getCo2Pcr = async (devicesIds = []) => {
    setLoading(true);

    console.log('IDS in function:', devicesIds);
    if (devicesIds?.length > 0) {
      try {
        const response = await fetchDeviceCo2Pcr(siteId, duration, devicesIds);

        console.log('Response from API', response);

        setCo2PcrChartData(response);

        // console.log('Metrics Data', response?.data?.data);
      } catch (err) {
        //   setError(err.message || 'Something went wrong');
      } finally {
      }
    } else {
      setCo2PcrChartData(co2PcrDevicesData);
    }
    setLoading(false);
    // try {
    //   const response = await fetchDeviceCo2Pcr(siteId, duration, devicesIds);

    //   console.log('Response from API', response);
    //   if (devicesIds.length > 0) {
    //     setCo2PcrChartData(response);
    //   } else {
    //     setCo2PcrChartData(response?.data?.data?.devices_data);
    //   }

    //   // console.log('Metrics Data', response?.data?.data);
    // } catch (err) {
    //   //   setError(err.message || 'Something went wrong');
    // } finally {
    //   setLoading(false);
    // }
    console.log('Response from API', co2pcrChartData);
  };

  // console.log('Co2 Pcr data', co2pcrChartData);

  //   Hooks
  useEffect(() => {
    siteNames();
  }, []);
  useEffect(() => {
    if (co2PcrDevicesData) {
      setCo2PcrChartData(co2PcrDevicesData);
    }
  }, [co2PcrDevicesData]);
  //   useEffect(() => {
  //     if (siteId && duration) {
  //       getMetrics();
  //     }
  //   }, [siteId, siteName]);
  useEffect(() => {
    if (siteId) {
      dispatch(fetchElectricityMapPiData(siteId, duration));
      dispatch(fetchPiChartData(siteId, access_token));
      dispatch(fetchRacksAsync(access_token));
      dispatch(fetchEnergyTrends(siteId, duration));
      dispatch(fetchTopFiveDevices(siteId, duration));
      dispatch(fetchDevicesData(siteId, access_token));
      dispatch(fetchCo2PcrDevicesData(siteId, duration));
    }
    if (siteId && duration) {
      getMetrics();
    }
  }, [siteId, duration]);
  useEffect(() => {
    if (sites?.length > 0) {
      if (contextSite.siteId && contextSite.siteName) {
        setSiteId(contextSite.siteId);
        setSiteName(contextSite.siteName);
      } else {
        const defaultSite = sites[0];
        setContextSite({
          siteId: defaultSite.value,
          siteName: defaultSite.label,
        });
        setSiteId(defaultSite.value);
        setSiteName(defaultSite.label);
      }
    }
  }, [sites, contextSite]);

  // Cards section Data:
  const {
    psu_stats,
    stack_stats,
    traffic_throughput_kw_per_gb,
    pcr_kw_per_gb,
  } = metricsData || {};

  // const cardsConfig = [
  //   {
  //     icon: <TbDeviceDesktop size={28} />,
  //     title: 'Total Onboarded Devices',
  //     value: metricsData?.total_devices,
  //     unit: '',
  //   },

  //   {
  //     icon: <AiOutlineDollarCircle size={28} />,
  //     title: ' Cost Estimation',
  //     value: metricsData?.cost_estimation,
  //     unit: metricsData?.cost_unit,
  //   },
  // ];
  const costDataAnalysis = metricsData?.cost_analysis;
  const co2DataAnalysisInkgs = metricsData?.c02_emmision_analysis?.co2_kgs;
  const costData = [
    { label: 'Daily', value: costDataAnalysis?.cost_estimation_daily },
    { label: 'Monthly', value: costDataAnalysis?.cost_estimation_monthly },
    { label: 'Yearly', value: costDataAnalysis?.cost_estimation_yearly },
    { label: '5 Years', value: costDataAnalysis?.cost_estimation_five_year },
  ];
  const carbonData = [
    { label: 'Daily', value: co2DataAnalysisInkgs?.co2_estimation_daily_kg },
    {
      label: 'Monthly',
      value: co2DataAnalysisInkgs?.co2_estimation_monthly_kg,
    },
    { label: 'Yearly', value: co2DataAnalysisInkgs?.co2_estimation_yearly_kg },
    {
      label: '5 Years',
      value: co2DataAnalysisInkgs?.co2_estimation_five_year_kg,
    },
  ];

  const clickToPage = () => {
    navigate('device_details', {
      state: {
        siteId: siteId,
        duration: duration,
      },
    });
  };
  return (
    <CustomSpin spinning={loading}>
      <div style={{ padding: '0px 5px 0px 5px' }}>
        <div
          style={{
            padding: '10px 10px 0px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            marginTop: '10px',
          }}
        >
          <div style={{ color: theme?.palette?.default_select?.color }}>
            {siteName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <LabeledInputWrapper theme={theme}>
              <div className="label">Select Duration</div>
              <div className="input-wrapper">
                <KpiSelector
                  options={kpiOptions}
                  handleDurationChange={handleDurationChange}
                  value={duration}
                  updatedDash={true}
                />
              </div>
            </LabeledInputWrapper>
            <LabeledInputWrapper theme={theme}>
              <div className="label">Select Site</div>
              <div className="input-wrapper">
                <DefaultSelector
                  options={sites}
                  onChange={handleChange}
                  value={siteName}
                />{' '}
              </div>
            </LabeledInputWrapper>
          </div>
        </div>
        {/* Cards Section for updated dashboard */}
        {/* <Row gutter={[16, 16]} style={{ padding: '10px 10px' }}>
          <Col xs={24} md={8}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {cardsConfig?.map((card) => {
                return (
                  <CustomCard
                    style={{
                      border: `1px solid ${theme?.palette?.default_card?.border}`,
                      backgroundColor: theme?.palette?.main_layout?.background,
                      borderRadius: '7px',
                      color: theme?.palette?.main_layout?.primary_text,
                      padding: '10px 25px',
                      height: '158px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '100% ',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'start',
                          alignItems: 'center',
                          gap: '15px',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: theme?.palette?.main_layout?.secondary_text,

                            padding: '4px',
                            borderRadius: '2px',
                            //   border: '1px solid white',
                          }}
                        >
                          {card?.icon}
                        </span>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            fontFamily: 'inter',
                            marginBottom: '0px',
                            marginTop: '0px',
                            letterSpacing: '0%',
                          }}
                        >
                          {card?.title}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: '26px',
                          fontWeight: 600,
                          marginBottom: '0px',
                          marginTop: '0px',
                        }}
                      >
                        {card?.value}{' '}
                        <span style={{ fontWeight: 400, fontSize: '16px' }}>
                          {card?.unit}
                        </span>
                      </p>
                    </div>
                  </CustomCard>
                );
              })}
            </div>
          </Col>
          <Col xs={24} md={8}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  height: '100%',
                }}
              >
                <ChartTitle theme={theme}>Power Usage</ChartTitle>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <PowerStatistic
                    isPowerStatistic={true}
                    data={{
                      powerUsagePer: metricsData?.power_usage_percentage,
                      inputPower: metricsData?.input_power_kw,
                      outputPower: metricsData?.output_power_kw,
                    }}
                  />
                </div>
              </div>
            </CustomCard>
          </Col>
          <Col xs={24} md={8}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  height: '100%',
                }}
              >
                <ChartTitle theme={theme}>Energy Efficiency Ratio</ChartTitle>
                <div
                  style={{
                    height: '200px', // match the height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 'auto',
                  }}
                >
                  <EnergyEfficiencyChart value={metricsData?.eer_per} />
                </div>

                <LegendRow
                  legendItems={[
                    {
                      label: 'Inefficient (0–50%)',
                      color: theme?.palette?.shades?.red,
                    },
                    {
                      label: 'Moderate (50–75%)',
                      color: theme?.palette?.shades?.light_blue,
                    },
                    {
                      label: 'Efficient (75–100%)',
                      color: theme?.palette?.shades?.light_green,
                    },
                  ]}
                />
              </div>
            </CustomCard>
          </Col>
        </Row> */}

        {/* Details cards for updated dashboard */}
        <DetailCardsSection siteId={siteId} metricsData={metricsData} />

        <Row gutter={[16, 16]} style={{ padding: '10px 10px' }}>
          <Col xs={24} md={8}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  height: '100%',
                }}
              >
                {/* <ChartTitle theme={theme}>Power Usage Effectivness</ChartTitle> */}
                {/* tab buttons */}
                <div
                  style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
                >
                  <TabButton
                    theme={theme}
                    onClick={() => setActiveView('eer')}
                    style={{
                      backgroundColor:
                        activeView === 'eer' ? '#141D2A' : '#0F1620',
                      border:
                        activeView === 'eer' ? '1px solid #34404b' : 'none',
                    }}
                  >
                    <span> Energy Efficiency Ratio</span>
                  </TabButton>
                  <TabButton
                    theme={theme}
                    onClick={() => setActiveView('pue')}
                    style={{
                      backgroundColor:
                        activeView === 'pue' ? '#141D2A' : '#0F1620',
                      border:
                        activeView === 'pue' ? '1px solid #34404b' : 'none',
                    }}
                  >
                    <span> Power Usage Effectivness</span>
                  </TabButton>
                </div>

                <div
                  style={{
                    height: '200px', // match the height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 'auto',
                  }}
                  onClick={() => {
                    clickToPage();
                  }}
                >
                  {activeView === 'eer' ? (
                    <EnergyEfficiencyChart value={metricsData?.eer_per} />
                  ) : (
                    <PowerUsageEffectivenessChart value={metricsData?.pue} />
                  )}
                </div>

                {activeView === 'eer' ? (
                  <LegendRow
                    legendItems={[
                      {
                        label: 'Inefficient (0–50%)',
                        color: theme?.palette?.shades?.red,
                      },
                      {
                        label: 'Moderate (50–75%)',
                        color: theme?.palette?.shades?.light_blue,
                      },
                      {
                        label: 'Efficient (75–100%)',
                        color: theme?.palette?.shades?.light_green,
                      },
                    ]}
                  />
                ) : (
                  <LegendRow
                    legendItems={[
                      {
                        label: 'Efficient (1 - 1.5)',
                        color: theme?.palette?.shades?.light_green,
                      },

                      {
                        label: 'Moderate (1.5 – 2.5)',
                        color: theme?.palette?.shades?.light_blue,
                      },
                      {
                        label: 'Inefficient (2.5 – 5)',
                        color: theme?.palette?.shades?.red,
                      },
                    ]}
                  />
                )}

                {/* <LegendRow
                  legendItems={[
                    {
                      label: 'Efficient (0 - 1.5)',
                      color: theme?.palette?.shades?.light_green,
                    },

                    {
                      label: 'Moderate (1.5 – 3.5)',
                      color: theme?.palette?.shades?.light_blue,
                    },
                    {
                      label: 'Inefficient (3.5 – 5)',
                      color: theme?.palette?.shades?.red,
                    },
                  ]}
                /> */}
              </div>
            </CustomCard>
          </Col>
          <Col xs={24} md={8}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <ChartTitle theme={theme}>Total Interfaces</ChartTitle>
              <Interfaces metricsData={metricsData} />
            </CustomCard>
          </Col>
          <Col xs={24} md={8}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  height: '100%',
                }}
              >
                <ChartTitle theme={theme}>Data Utilization</ChartTitle>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <PowerStatistic
                    data={{
                      inputTraffic: metricsData?.datatraffic_allocated_gb,
                      outputTraffic: metricsData?.datatraffic_consumed_gb,
                      dataUtilization: metricsData?.datautilization_per,
                    }}
                    isPowerStatistic={false}
                  />
                  <LegendRow
                    legendItems={[
                      {
                        label: 'Data Utilization',
                        color: theme?.palette?.shades?.dark_purple,
                      },
                    ]}
                  />
                </div>
                {/* <LegendRow
                  legendItems={[
                    {
                      label: 'Data Utilization',
                      color: theme?.palette?.shades?.dark_purple,
                    },
                  ]}
                /> */}
              </div>
            </CustomCard>
          </Col>
        </Row>
        {/* Co2 Emission Row */}
        <Co2EmissionSection
          metricsData={metricsData}
          electricityMapData={electricityMapData}
        />
        <div className="cardsSection" style={{ padding: ' 10px' }}>
          <CardsSection
            psu_stats={psu_stats}
            stack_stats={stack_stats}
            traffic_throughput_kw_per_gb={traffic_throughput_kw_per_gb}
            pcr_kw_per_gb={pcr_kw_per_gb}
          />
        </div>

        {/* Energy and Traffic Trends */}
        <EnergyTraficChart
          energyData={energyData}
          energyTrendsLoading={energyTrendsLoading}
        />
        <Row gutter={[16, 16]} style={{ padding: '10px 10px' }}>
          <Col xs={24} lg={12}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <CostBreakDownChart
                chartTitle="Cost Estimation"
                data={costData}
                selectedCurrency={metricsData?.cost_unit}
                parent="costAnalysis"
              />
            </CustomCard>
          </Col>
          <Col xs={24} lg={12}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.main_layout?.background,
                borderRadius: '7px',
                color: theme?.palette?.main_layout?.primary_text,
              }}
            >
              <CostBreakDownChart
                chartTitle="Carbon Footprint"
                data={carbonData}
                selectedCurrency="kg"
                parent="carbonEmission"
              />
            </CustomCard>
          </Col>
        </Row>
        {/* old top 5 devices that works */}
        {/* <Row gutter={[16, 16]} style={{ padding: '10px' }}>
          <Col xs={24} lg={12}>
            <CustomSpin spinning={topFiveDevicesLoading}>
              <TopFiveDevicesTable
                title={'Top 5 Devices by Co2 Emission from Last Month'}
                columns={topFiveTablecolumns}
                spinnerLoading={loading}
                dataSource={top5_devices_by_carbonemmison}
              />
            </CustomSpin>
          </Col>
          <Col xs={24} lg={12}>
            <CustomSpin spinning={topFiveDevicesLoading}>
              <TopFiveDevicesTable
                title={'Top 5 Devices by Cost Estimation'}
                columns={topFiveCostTablecolumns}
                spinnerLoading={loading}
                dataSource={top5_devices_by_cost}
              />
            </CustomSpin>
          </Col>
        </Row> */}
        <TopFiveDevicesSection metricsData={metricsData} duration={duration} />
        <Row gutter={[16, 16]} style={{ padding: '10px' }}>
          <Col id="hl" xs={24} lg={8}>
            <HardwareLifeCycle siteName={siteName} newDashboard={true} />
          </Col>
          <Col id="hmr" xs={24} lg={16}>
            <DevicesHeatMap siteId={siteId} />
          </Col>
        </Row>
        {/* Device level co2 and pcr compare chart */}
        <DeviceCo2PowerCompareChart
          loading={loading}
          chartData={co2pcrChartData}
          getCo2Pcr={getCo2Pcr}
          onClick={() => {
            return alert('click');
          }}
        />
      </div>
    </CustomSpin>
  );
}

export default UpdatedDashboard;
