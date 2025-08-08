import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DefaultTable from '../../../components/tables';
import { Spin } from 'antd';
import { BaseUrl } from '../../../utils/axios';
import axios from 'axios';
import {
  InboxOutlined,
  EyeOutlined,
  BackwardOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Progress,
  Button,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import useColumnSearchProps from '../../../hooks/useColumnSearchProps';
import {
  fetchDevicePowerPerHour,
  fetchDevicePowerUtilization,
  fetchDeviceTrafficPerHour,
} from '../../../services/devicesServices';
// const data = [];
const TopDevicesDetail = () => {
  const [apicData, setApicData] = useState();
  const [apicDataPerHour, setApicDataPerHour] = useState();
  const [throughput, setThroughput] = useState();
  const getColumnSearchProps = useColumnSearchProps();

  const navigate = useNavigate();
  const data = useSelector((state) => state.topDevicesPowerCostClickData?.data);
  console.log(data, 'data');

  const isLoading = useSelector(
    (state) => state.topDevicesPowerCostClickData.loading
  );

  const columns = [
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
      ...getColumnSearchProps(),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Cost (AED)',
      dataIndex: 'cost',
      key: 'cost',
      ...getColumnSearchProps(),
    },
    {
      title: 'Power Usage (KW)',
      dataIndex: 'power_usage',
      key: 'power_usage',
    },
    {
      title: 'Traffic Throughput (GB)',
      dataIndex: 'traffic_throughput',
      key: 'traffic_throughput',
    },
  ];

  const deviceTraffic = async () => {
    const payload = {
      apic_controller_ip: data?.device_ip,
    };
    try {
      // const res = await axios.post(BaseUrl + `/devicetrafficperhr`, payload);
      const res = await fetchDeviceTrafficPerHour(payload);
      console.log(res, 'traffic throughput');
      setThroughput(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const ApicDataPerHour = async () => {
    // const payload = {
    //   apic_controller_ip: data?.device_ip,
    // };
    const apic_controller_ip = data?.device_ip;
    //this service is used from devices services
    const response = await fetchDevicePowerPerHour(apic_controller_ip);
    console.log('Top Devices PPH:::', response);

    // const response = await axios.post(BaseUrl + `/devicePowerperhr`, payload);
    setApicDataPerHour(response);
    console.log(response.data, 'trywty');
  };

  const getPowerUtilization = async () => {
    // const payload = {
    //   apic_controller_ip: data?.device_ip,
    // };
    const apic_controller_ip = data?.device_ip;
    const res = await fetchDevicePowerUtilization(apic_controller_ip);
    setApicData(res);
    // const res = await axios.post(
    //   BaseUrl +
    //     `/device_inventory/deviceLastPowerUtiization?apic_api=${data?.device_ip}`
    // );

    // setApicData(res?.data);
  };

  useEffect(() => {
    getPowerUtilization();
    ApicDataPerHour();
    deviceTraffic();
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
          color: '#B9B9B9',
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
          color: color ? '#0490E7' : '#FFFFFF',
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
  return (
    <>
      <Button
        style={{
          marginTop: '20px',
          marginLeft: '1px',
          background: 'transparent',
          color: '#E4E4E4',
          border: 'unset',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
        }}
        onClick={() => navigate(-1)}
      >
        <BackwardOutlined />
        <p style={{ marginTop: '16.5px' }}>Dashboard</p>
      </Button>

      <div
        style={{
          color: '#e5e5e5',
          fontSize: '15px',
          width: '94.3%',
          margin: '0 auto',
          height: 'auto',
          border: '1px solid #36424E',
          borderRadius: '4px',
          padding: '10px 20px 10px 20px',
          background: '#050C17',
        }}
      >
        <div
          style={{
            height: '85%',
            padding: '0 5px 0 5px',
          }}
        >
          <Row>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Device Name" value={data?.device_name} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Device IP" value={data?.device_ip} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue
                label="Device Serial Number"
                value={data?.serial_number}
              />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="PN Code" value={data?.pn_code} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Site Name" value={data?.site_name} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Rack Name" value={data?.rack_name} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Department" value={data?.department} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Domain" value={data?.cisco_domain} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue
                label="Software Version"
                value={data?.software_version}
              />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="RU" value={data?.device_ru} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="End Of HW Life" value={data?.hw_eol_date} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="End Of HW Sale" value={data?.hw_eos_date} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="End Of SW Life" value={data?.sw_eol_date} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="End Of SW Sale" value={data?.sw_eos_date} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue
                label="HardwarecVersion"
                value={data?.hardware_version}
              />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Manufacturer" value={data?.manufacturer} />
            </Col>

            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Section" value={data?.section} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Power Input" value={data?.power_input} />
            </Col>
            <Col xs={24} md={12} lg={4} style={{ padding: '10px' }}>
              <LabelledValue label="Estimated Cost" value={data?.cost} />
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
                <label htmlFor="" style={{ color: '#B9B9B9' }}>
                  Power Utilization
                </label>
                <Progress
                  style={{ marginBottom: '0px', marginTop: '10px' }}
                  size={[250, 30]}
                  trailColor="#16212A"
                  strokeColor={'#4C791B'}
                  percent={data?.power_utilization}
                  format={(percent) => (
                    <span style={{ color: '#B9B9B9' }}>{`${percent}%`}</span>
                  )}
                  status="active"
                  gapDegree={0}
                />
              </div>
            </Col>
            {/* <Col
            xs={24}
            md={12}
            lg={6}
            style={{
              padding: "10px 0 0 10px",
            }}
          >
            <div
              style={{
                marginBottom: "0px",
                paddingTop: "10px",
                width: "100%",
                paddingLeft: "10px",
              }}
            >
              <label htmlFor="" style={{ color: "#B9B9B9" }}>
                Power Efficiency
              </label>
              <Progress
                style={{ marginBottom: "0px", marginTop: "5px" }}
                size={[250, 30]}
                trailColor="#16212A"
                strokeColor={"#B28922"}
                percent={100 - apicData?.power_efficiency}
                format={(percent) => (
                  <span style={{ color: "#B9B9B9" }}>{`${percent}%`}</span>
                )}
                status="active"
                gapDegree={0}
              />
            </div>
          </Col> */}

            {/* <Col xs={24} md={12} lg={4} style={{ padding: "10px" }}>
            <label htmlFor="" style={{ color: "#B9B9B9" }}>
              Power Efficiency
            </label>
            <br />
            <Progress
              style={{ marginTop: "10px" }}
              type="circle"
              percent={30}
              size={80}
              strokeColor={["#71B626", "#406E0E"]}
              format={(percent) => (
                <span style={{ color: "#B9B9B9" }}>{`75%`}</span>
              )}
            />
          </Col>
          <Col xs={24} md={12} lg={4} style={{ padding: "10px" }}>
            <label htmlFor="" style={{ color: "#B9B9B9" }}>
              Input Power
            </label>{" "}
            <br />
            <Progress
              style={{ marginTop: "10px" }}
              type="circle"
              percent={75}
              size={80}
              strokeColor={strokeColors}
              format={(percent) => (
                <span style={{ color: "#B9B9B9" }}>{`75%`}</span>
              )}
            />
          </Col> */}
            <Col xs={24} md={12} lg={4} style={{ padding: '20px 10px' }}>
              <div style={{ paddingLeft: '10px' }}>
                <label
                  style={{ fontSize: '12px', color: '#B9B9B9d' }}
                  htmlFor=""
                >
                  Status
                </label>
                <div
                  style={{
                    marginTop: '10px',
                    background: '#71B62633',
                    color: '#C8FF8C',
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
                  {data?.status}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div
        style={{
          color: '#e5e5e5',
          padding: '10px 10px 0 10px',
        }}
      >
        <Row>
          <Col sm={24} lg={12} style={{ padding: '10px' }}>
            <div
              style={{
                border: '1px solid #36424E',
                borderRadius: '4px',
                height: '260px',
                marginBottom: '20px',
                background: '#050C17',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#E5E5E5',
                  paddingLeft: '20px',
                  marginBottom: '0px',
                }}
              >
                Power Usage{' '}
                <span style={{ fontSize: '12px', fontWeight: 400 }}>
                  (Hourly)
                </span>
              </p>

              {/* <EChartsGauge
                data={apicData ? apicData[0]?.power_utilization : 0}
              /> */}
            </div>
            <div
              style={{
                border: '1px solid #36424E',
                borderRadius: '4px',
                height: 'auto',
                background: '#050C17',
                paddingLeft: '10px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#E5E5E5',
                  paddingLeft: '7px',
                  marginBottom: '20px',
                }}
              >
                Device Power Throughput
              </p>
              {/* <PowerUtilizationChart dataa={throughput} isByteRate="true" /> */}
            </div>
          </Col>
          <Col sm={24} lg={12} style={{ padding: '10px' }}>
            <div
              style={{
                // width: "30%",
                position: 'relative',
                border: '1px solid #36424E',
                borderRadius: '4px',
                padding: '30px 0 30px 100px',
                height: '578px',
                overflowY: 'auto',
                background: '#050C17',
              }}
            >
              {/* <img src={device} width={250} height={500} /> */}
              {/* <RuDevice /> */}
            </div>
          </Col>
        </Row>
      </div>

      <div
        style={{
          padding: '0 10px 0 10px',
          minHeight: 360,
        }}
      >
        <Row>
          <Col sm={24} lg={12} style={{ padding: '10px' }}>
            <div
              style={{
                border: '1px solid #36424E',
                borderRadius: '4px',
                height: 'auto',
                background: '#050C17',
                paddingLeft: '10px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#E5E5E5',
                  paddingLeft: '7px',
                  marginBottom: '10px',
                }}
              >
                Device Power Utilization
              </p>
              {/* <PowerUtilizationChart dataa={apicDataPerHour} /> */}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default TopDevicesDetail;
