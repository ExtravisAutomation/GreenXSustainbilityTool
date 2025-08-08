import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Col, Row } from "antd";
import CustomCard from "../../../components/customCard";
import EChartsGauge from "../../uamModule/inventory/guage";
import CustomProgress from "../../../components/customProgress";
import AnomaliesChart from "../../../components/anomaliesDetectionChart";
import RealTimePowerConsuptionChart from "../../../components/realTimePcChart";
import ConsumedHostChart from "../../../components/consumedHostChart";
import CustomAccordion from "./customAccordion";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import BackButton from "../../../components/backButton";
const HostDetails = () => {
  const access_token = localStorage.getItem("access_token");
  const theme = useTheme();
  const location = useLocation();
  const [hourlyStorage, setHourlyStorage] = useState([]);
  const [usagesData, setUsagesData] = useState([]);
  const [hostutilizations, setHostutilizations] = useState();
  const [hostDetails, setHostDetails] = useState();
  const { data } = location.state || {};
  const fetchData = async () => {
    try {
      const payload = {
        hostname: data?.host_name,
      };
      const gethostutilizations = await axios.post(
        baseUrl + "/vcenter/gethostutilizations/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setHostutilizations(gethostutilizations);
      const resHStorage = await axios.post(
        baseUrl + "/vcenter/getHostHourlyStorage/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setHourlyStorage(resHStorage);

      const gethostusages = await axios.post(
        baseUrl + "/vcenter/gethostusages/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setUsagesData(gethostusages.data);
      const gethostdetails = await axios.post(
        baseUrl + "/vcenter/gethostdetails/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setHostDetails(gethostdetails.data.data);
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
        padding: "10px",
        width: "100%",
        marginBottom: "0px",
      }}
    >
      <label
        style={{
          fontWeight: 400,
          fontSize: "12px",
          color: "#B9B9B9",
        }}
      >
        {label}
      </label>
      <div
        style={{
          marginTop: "5px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "40px",
          borderRadius: "8px",
          // background: "#16212A",
          color: color ? "#0490E7" : "#FFFFFF",
          fontSize: "14px",
          fontWeight: 500,
          // paddingLeft: "10px",
          marginBottom: "0px",
        }}
      >
        {value}
        {label == "Data Traffic" ? " Gb/s" : ""}
      </div>
    </div>
  );
  const conicColors = {
    "0%": "#71B626",
    // "50%": "#074F84",
    "100%": "#406E0E",
  };

  return (
    <div style={{ height: "auto", width: "98%", margin: "0 auto" }}>
      <BackButton style={{ margin: "5px 0 0 3px" }} />
      {/* <CustomCard
        style={{
          border: "1px solid #36424E",
          borderRadius: "4px",
          background: "#050C17",
          margin: "10px 10px 10px 10px",
          color: "white",
        }}
      >
        <Row>
          <Col xs={24}>
            <Row>
              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue label="Host Name" value={data.host_name} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue label="Guest OS" value={data.guest_os} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue
                  label="Compatibility"
                  value={data.compatibility}
                />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue label="VMware Tools" value={data.vmware_tools} />
              </Col>
              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue label="CPUs" value={data.num_cpus} />
              </Col>

              <Col xs={24} md={12} lg={4} style={{ padding: "0 10px" }}>
                <LabelledValue label="Memory" value={data.total_memory_GB} />
              </Col>
            </Row>
          </Col>
        </Row>
      </CustomCard> */}

      <Row>
        <Col xs={24} sm={12} xl={6} style={{ padding: "10px" }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              color: theme?.palette?.default_card?.color,
              borderRadius: "4px",
              height: "260px",
            }}
          >
            <p
              style={{
                marginTop: "0px",
                marginBottom: "0px",
                fontWeight: 700,
                fontSize: "17px",
                color: theme?.palette?.default_card?.color,
              }}
            >
              CPU
            </p>
            <EChartsGauge
              cpu="true"
              data={hostutilizations?.data.data[0]?.cpu_usage_percent}
            />
          </CustomCard>
        </Col>

        <Col xs={24} sm={12} xl={6} style={{ padding: "10px" }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              color: theme?.palette?.default_card?.color,
              borderRadius: "4px",
              height: "260px",
              color: "white",
            }}
          >
            <p
              style={{
                marginTop: "0px",
                fontWeight: 700,
                fontSize: "17px",
                color: theme?.palette?.default_card?.color,
              }}
            >
              Memory
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomProgress
                percent={hostutilizations?.data.data[0]?.memory_usage_percent}
                graphValue={
                  hostutilizations?.data.data[0]?.memory_usage_percent
                }
                //   name={"gdjhd"}
                type="circle"
                strokeWidth="10"
                size={[160]}
                style={{}}
                conicColors={conicColors}
                memory="true"
              />
              {/* <EChartsGauge
                memory="true"
                data={hostutilizations?.data.data[0]?.used_memory_gb}
              /> */}
            </div>
          </CustomCard>
        </Col>
        <Col xs={24} xl={12} style={{ padding: "10px" }}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.default_card?.background,
              color: theme?.palette?.default_card?.color,
              borderRadius: "4px",
              height: "260px",
              color: "white",
            }}
          >
            <RealTimePowerConsuptionChart data={hourlyStorage} />
          </CustomCard>
        </Col>
      </Row>
      <CustomCard
        style={{
          border: `1px solid ${theme?.palette?.default_card?.border}`,
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.default_card?.color,
          borderRadius: "4px",
          height: "340px",
          margin: "10px",
        }}
      >
        <ConsumedHostChart host="true" data={usagesData} />
      </CustomCard>
      <Row>
        <Col xs={24} style={{ padding: "10px" }}>
          <div
            style={{
              backgroundColor: theme?.palette?.default_card?.background,
              padding: "5px 10px",
            }}
          >
            <p
              style={{
                color: theme?.palette?.default_card?.color,
                margin: "10px 0px",
                fontWeight: 700,
              }}
            >
              Hardware
            </p>
          </div>
          <CustomAccordion host="true" data={data} />
        </Col>
      </Row>
      {/* <Row>
        <Col xs={24} lg={12} style={{ padding: "10px" }}>
          <div style={{ background: "#050C17", padding: "5px 10px" }}>
            <p style={{ color: "white", margin: "10px 0px" }}>
              General Information
            </p>
          </div>
          <CustomAccordion data={HostDetails} />
        </Col>
        <Col xs={24} lg={12} style={{ padding: "10px" }}>
          <div style={{ background: "#050C17", padding: "5px 10px" }}>
            <p style={{ color: "white", margin: "10px 0px" }}>
              Hardware Configuration
            </p>
          </div>
          <CustomAccordion hardware="true" data={HostDetails} />
        </Col>
      </Row> */}
    </div>
  );
};

export default HostDetails;
