import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Spin, Button } from 'antd';
import { BackwardOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import CustomCard from '../../../components/customCard';
import EcForecastChart from '../../../components/ecForcastChart';
import CustomProgress from '../../../components/customProgress';
import CustomSelector from '../../../components/customSelector';
import KpiSelector from './kpiSelector';
import BackButton from '../../../components/backButton';
import DeviceSpecificConsuptionChart from '../../../components/deviceSpecificPConsumption';
import { fetchDeviceSpecificChartData } from '../../../store/features/dashboardModule/actions/deviceSpecificChartAction';
import { fetchDeviceSpecificComparisonData } from '../../../store/features/dashboardModule/actions/comparison/deviceSpecificComparison';
import { fetchThroughputComparisonData } from '../../../store/features/dashboardModule/actions/comparison/throughputComparisonAction';
import { fetchPseComparisonData } from '../../../store/features/dashboardModule/actions/comparison/pseComparison';
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { fetchDevicesData } from '../../../store/features/dashboardModule/actions/devicesAction';
import { useTheme } from '@mui/material/styles';
import DefaultSelector from '../../../components/defaultSelector';

const DeviceSpecificComparison = () => {
  const theme = useTheme();

  const [siteId, setSiteId] = useState(null);
  const [siteName, setSiteName] = useState(null);
  // const [sites, setSites] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceName1, setDeviceName1] = useState(null);
  const [deviceName2, setDeviceName2] = useState(null);
  const [duration, setDuration] = useState('24 hours');
  const access_token = localStorage.getItem('access_token');

  // console.log(deviceName1, 'device name');
  // console.log(deviceName2, 'device name2');

  const devices = useSelector((state) => state.devices?.data?.data);
  const sites = useSelector((state) => state.sites?.sites);
  const dispatch = useDispatch();
  const { Option } = Select;
  // console.log('devices...', devices);

  useEffect(() => {
    if (devices?.length > 0) {
      // old code for device_name1 and device_name2
      // setDeviceName1(devices[1]?.device_name);
      // setDeviceName2(devices[11]?.device_name);
      // mycode:
      setDeviceName1(devices[0]?.device_name);
      setDeviceName2(devices[4]?.device_name);
    }
  }, [devices]);
  // const updatedDevices = devices?.map((item) => {
  //   return {
  //     label: item?.device_name,
  //     value: item?.id,
  //   };
  // });
  const updatedDevices = devices?.map((item) => ({
    label: item?.device_name,
    value: item?.device_name, // using device_name instead of id
  }));
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

  useEffect(() => {
    dispatch(fetchsitesAsync());
  }, [dispatch]);
  useEffect(() => {
    if (sites?.length > 0) {
      setSiteId(sites && sites[0]?.id);
      setSiteName(sites && sites[0]?.site_name);
    }
  }, [sites]);
  useEffect(() => {
    if (siteId && access_token) {
      dispatch(fetchDevicesData(siteId, access_token));
    }
  }, [siteId, access_token]);
  useEffect(() => {
    if (siteId) {
      compare();
    }
  }, [siteId]);

  // mycode test:::
  // const siteNames = async () => {
  //   try {
  //     const sitesss = await axiosInstance.get('/sites/get_site_names');
  //     setSites(
  //       sitesss.data.data.map((item) => {
  //         return {
  //           label: item?.site_name,
  //           value: item?.id,
  //         };
  //       })
  //     );
  //   } catch (error) {
  //     console.log(' error', error);
  //   }
  // };

  // useEffect(() => {
  //   siteNames();
  // }, []);

  const structuredSites = sites?.map((item) => {
    return {
      label: item?.site_name,
      value: item?.id,
    };
  });
  // console.log('Mycode:::: sites in compare', structuredSites);
  const compare = () => {
    dispatch(
      fetchDeviceSpecificComparisonData(
        siteId,
        deviceName1,
        deviceName2,
        duration
      )
    );
    dispatch(
      fetchThroughputComparisonData(siteId, deviceName1, deviceName2, duration)
    );
    dispatch(
      fetchPseComparisonData(siteId, deviceName1, deviceName2, duration)
    );
  };

  const comparedDevicesData = useSelector(
    (state) => state?.comparedDevicesData?.data?.data
  );
  const comparedThroughputData = useSelector(
    (state) => state?.comparedThroughputData?.data?.data
  );
  const comparedPseData = useSelector(
    (state) => state?.comparedPseData?.data?.data
  );

  const ttLoader = useSelector((state) => state.comparedThroughputData.loading);
  const pseLoader = useSelector((state) => state.comparedPseData.loading);
  const cdLoader = useSelector((state) => state.comparedDevicesData.loading);
  const handleDropdownVisibleChange = async (open) => {
    setOptions(sites);
  };
  const handleChange = (value, option) => {
    setSiteId(value);
    // console.log(option, "option site");
    setSiteName(option.children);
  };

  const dataDevice1 = [42, 50, 48, 45, 60, 50, 63, 70];
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
    {
      value: 'Last 3 Months',
      label: 'Last 3 Months',
    },
    {
      value: 'Last 6 Months',
      label: 'Last 6 Months',
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
  const legends = ['Device 1', 'Device 3'];
  // mycode
  const handleChangeDevice1 = (value) => {
    setDeviceName1(value); // value is device_name now
  };

  const handleChangeDevice2 = (value) => {
    setDeviceName2(value); // value is device_name now
  };

  console.log(
    'Current Theme:::::::::color',
    theme?.palette?.defaut_select?.dropdown
  );

  return (
    <div style={{ padding: '10px' }}>
      <div
        style={{
          width: '98.5%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        {/* <div style={{ color: "white" }}>{siteName}</div> */}
        <BackButton>
          <BackwardOutlined />
        </BackButton>

        <DefaultSelector
          options={structuredSites}
          onChange={handleChange}
          value={siteName}
        />
        {/* ant design Selector */}
        {/* <Select
          className="dashboard_selector"
          showSearch
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option.children ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA.children ?? '')
              .toLowerCase()
              .localeCompare((optionB.children ?? '').toLowerCase())
          }
          loading={loading}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          onChange={handleChange}
          value={siteName}
          // issue_to
          dropdownStyle={{
            backgroundColor: `${theme?.palette?.default_select?.dropDown}`,
            color: 'white',
          }}
        >
          {options?.map((option) => (
            <Option key={option.value} value={option.id}>
              {option.site_name}
            </Option>
          ))}
        </Select> */}
      </div>
      <div
        style={{
          // width: "98.5%",
          // margin: "0 auto",
          padding: '10px 10px 5px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          // alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* <CustomSelector
          options={devices}
          deviceName={deviceName1}
          setDeviceName={setDeviceName1}
          defaultValue={devices ? devices[1] : null}
          style={{
            width: "90%",
            height: "35px",
          }}
        /> */}
        {/* old code */}
        {/* <DefaultSelector
          options={updatedDevices}
          onChange={handleChangeDevice1}
          value={deviceName1}
          raks="true"
        />

        <DefaultSelector
          options={updatedDevices}
          onChange={handleChangeDevice2}
          value={deviceName2}
          raks="true"
        /> */}
        {/* Mycode */}

        <div style={{ display: 'flex', gap: '20px', width: '58%' }}>
          <div style={{ flex: 1 }}>
            <DefaultSelector
              options={
                updatedDevices?.filter(
                  (device) => device.value !== deviceName2
                ) || []
              }
              onChange={handleChangeDevice1}
              value={deviceName1}
              raks="true"
              // width={500}
            />
          </div>
          <div style={{ flex: 1 }}>
            <DefaultSelector
              options={
                updatedDevices?.filter(
                  (device) => device.value !== deviceName1
                ) || []
              }
              onChange={handleChangeDevice2}
              value={deviceName2}
              raks="true"
              width={500}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            width: '41%',
            justifyContent: 'end',
          }}
        >
          <div style={{ flex: 1 }}>
            <KpiSelector
              options={durations}
              setDuration={setDuration}
              value={duration}
              comparison="true"
              compareP
              style={{
                width: '90%',
                height: '35px',
              }}
            />
          </div>
          <Button
            style={{
              background: theme?.palette?.main_layout?.secondary_text,
              borderRadius: '4px',
              color: '#FFFFFF',
              fontSize: '14px',
              border: 'unset',
              width: '150px',
              height: '41px',
              fontWeight: 600,
            }}
            onClick={compare}
          >
            Compare
          </Button>
        </div>
      </div>
      <Row>
        <Col xs={24} lg={14} style={{ padding: '10px' }}>
          <Spin spinning={ttLoader}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.default_card?.background,
                borderRadius: '7px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  Devices Data Traffic Comparison
                </p>
              </div>
              {comparedThroughputData?.length > 0 ? (
                <EcForecastChart
                  legends={legends}
                  dataDevice1={dataDevice1}
                  deviceName1={deviceName1}
                  deviceName2={deviceName2}
                  dashboard="true"
                  comparedThroughputData={comparedThroughputData}
                />
              ) : (
                <div
                  style={{
                    height: '260px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                  }}
                >
                  <p>No data</p>
                </div>
              )}
            </CustomCard>
          </Spin>
        </Col>
        <Col xs={24} lg={10} style={{ padding: '10px' }}>
          <Spin spinning={pseLoader}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.default_card?.background,
                borderRadius: '4px',

                height: '333px',
              }}
              title="Power Supply Efficiency"
            >
              <p
                style={{
                  marginTop: '0px',
                  color: theme?.palette?.main_layout?.primary_text, // Change title text color
                  fontSize: '16px',
                  marginBottom: '50px',
                }}
              >
                Energy Efficiency
              </p>

              <Row>
                {comparedPseData?.map((data) => (
                  <Col
                    xs={24}
                    sm={12}
                    style={{ padding: '10px', textAlign: 'center' }}
                  >
                    <CustomProgress
                      percent={data?.average_power_percentage}
                      name={data?.device_name}
                      type="circle"
                      strokeWidth="10"
                      size={[130]}
                      style={{}}
                      conicColors={
                        theme?.name.includes('Purple')
                          ? conicColors_power_purple
                          : conicColors_power
                      }
                    />
                  </Col>
                ))}
              </Row>
            </CustomCard>
          </Spin>
        </Col>
      </Row>

      <Row>
        <Col xs={24} style={{ padding: '10px' }}>
          <Spin spinning={cdLoader}>
            <CustomCard
              style={{
                border: `1px solid ${theme?.palette?.default_card?.border}`,
                backgroundColor: theme?.palette?.default_card?.background,
                borderRadius: '7px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  Device-Specific Power Consumption Analysis
                </p>
                {/* <CustomSelector options={devices} /> */}
              </div>
              <DeviceSpecificConsuptionChart
                comparedDevicesData={comparedDevicesData}
                dashboard="true"
                deviceName1={deviceName1}
                deviceName2={deviceName2}
              />
            </CustomCard>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceSpecificComparison;
