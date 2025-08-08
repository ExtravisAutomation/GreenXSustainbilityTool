import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Col, Row } from 'antd';
import CustomCard from '../../../components/customCard';
import EChartsGauge from '../../uamModule/inventory/guage';
import CustomProgress from '../../../components/customProgress';
import AnomaliesChart from '../../../components/anomaliesDetectionChart';
import RealTimePowerConsuptionChart from '../../../components/realTimePcChart';
import ConsumedHostChart from '../../../components/consumedHostChart';
import CustomAccordion from './customAccordion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import { BaseUrl } from '../../../utils/axios';
import BackButton from '../../../components/backButton';
import axiosInstance from '../../../utils/axios/axiosInstance';
const VmDetails = () => {
  const theme = useTheme();
  const location = useLocation();
  const [hourlyStorage, setHourlyStorage] = useState([]);
  const [usagesData, setUsagesData] = useState([]);
  const [vmdetails, setVmdetails] = useState();
  const { data } = location.state || {};
  console.log('hourlyStorage', hourlyStorage);
  const fetchData = async () => {
    try {
      const payload = {
        hostname: data?.hostname,
      };
      const resHStorage = await axiosInstance.post(
        '/vcenter/getHourlyStorage/',
        payload
      );
      setHourlyStorage(resHStorage);
      const resUsages = await axiosInstance.post(
        '/vcenter/getusages/',
        payload
      );
      setUsagesData(resUsages.data);
      const resVmdetails = await axiosInstance.post(
        '/vcenter/getvmsdetails/',
        payload
      );
      setVmdetails(resVmdetails.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
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
          color: color ? '#0490E7' : theme?.palette?.main_layout?.primary_text,
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
  const conicColors = {
    '0%': '#71B626',
    // "50%": "#074F84",
    '100%': '#406E0E',
  };

  return (
    <div style={{ height: 'auto', width: '98%', margin: '0 auto' }}>
      <BackButton style={{ margin: '5px 0 0 3px' }} />
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          borderRadius: '4px',
          backgroundColor: theme?.palette?.default_card?.background,
          margin: '10px 10px 10px 10px',
          color: theme?.palette?.default_card?.color,
        }}
      >
        <Row>
          <Col xs={24}>
            <Row>
              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue label="Host Name" value={data.hostname} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue label="Guest OS" value={data.guest_os} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue
                  label="Compatibility"
                  value={data.compatibility}
                />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue label="VMware Tools" value={data.vmware_tools} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue label="CPUs" value={data.num_cpus} />
              </Col>

              <Col xs={24} md={12} lg={4} style={{ padding: '0 10px' }}>
                <LabelledValue label="Memory" value={data.total_memory_GB} />
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomCard>

      <Row>
        <Col xs={24} sm={12} xl={6} style={{ padding: '10px' }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              // width: "300px",
              borderRadius: '4px',
              backgroundColor: theme?.palette?.default_card?.background,
              // padding: "20px 20px 0px 0px",
              height: '260px',
              color: theme?.palette?.default_card?.color,
            }}
          >
            <p
              style={{
                marginTop: '0px',
                marginBottom: '0px',
                fontWeight: 700,
                fontSize: '17px',
                color: theme?.palette?.default_card?.color,
              }}
            >
              Current CPU Utilization (%)
            </p>
            <EChartsGauge cpu="true" data={data?.cpu_usage_percent} />
          </CustomCard>
        </Col>

        <Col xs={24} sm={12} xl={6} style={{ padding: '10px' }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              // width: "300px",
              borderRadius: '4px',
              backgroundColor: theme?.palette?.default_card?.background,
              // padding: "20px 20px 0px 0px",
              height: '260px',
              color: 'white',
            }}
          >
            <p
              style={{
                marginTop: '0px',
                fontWeight: 700,
                fontSize: '17px',
                color: theme?.palette?.default_card?.color,
              }}
            >
              Current Memory Utilization (%)
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CustomProgress
                percent={data?.memory_usage_percent}
                graphValue={data?.memory_usage_percent}
                //   name={"gdjhd"}
                type="circle"
                strokeWidth="10"
                size={[150]}
                style={{}}
                conicColors={conicColors}
                memory="true"
              />
            </div>
          </CustomCard>
        </Col>
        <Col xs={24} xl={12} style={{ padding: '10px' }}>
          <CustomCard
            style={{
              borderRadius: '4px',
              height: '260px',
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              color: theme?.palette?.default_card?.color,
            }}
          >
            <RealTimePowerConsuptionChart data={hourlyStorage} />
          </CustomCard>
        </Col>
      </Row>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          // width: "300px",
          borderRadius: '4px',
          backgroundColor: theme?.palette?.default_card?.background,
          // padding: "20px 20px 0px 0px",
          height: '340px',
          color: theme?.palette?.default_card?.color,
          margin: '10px',
        }}
      >
        <ConsumedHostChart data={usagesData} />
      </CustomCard>
      <Row>
        <Col xs={24} lg={12} style={{ padding: '10px' }}>
          <div
            style={{
              background: theme?.palette?.default_card?.background,
              padding: '5px 10px',
            }}
          >
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                margin: '10px 0px',
              }}
            >
              General Information
            </p>
          </div>
          <CustomAccordion data={vmdetails} />
        </Col>
        <Col xs={24} lg={12} style={{ padding: '10px' }}>
          <div
            style={{
              background: theme?.palette?.default_card?.background,
              padding: '5px 10px',
            }}
          >
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                margin: '10px 0px',
              }}
            >
              Hardware Configuration
            </p>
          </div>
          <CustomAccordion hardware="true" data={vmdetails} />
        </Col>
      </Row>
    </div>
  );
};

export default VmDetails;
