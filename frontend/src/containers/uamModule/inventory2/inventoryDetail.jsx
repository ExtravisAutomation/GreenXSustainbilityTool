import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import device from "../../../resources/svgs/device.png";
import devicedetail from "../../../resources/svgs/devicedetail.png";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Row,
  Col,
  Progress,
  Button,
} from "antd";
import { useLocation } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PowerUtilizationChart from "./powerUtilization";
import { PowerUtilizationChart1 } from "./powerUtilization";

import { BackwardOutlined } from "@ant-design/icons";
import { green } from "@mui/material/colors";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import { BaseUrl } from "../../../utils/axios";
import RuDevice from "./ruDevice";
import Guage from "./guage";
import EChartsGauge from "./guage";
import { useSelector, useDispatch } from "react-redux";
import { fetchTopDevicesClickData } from "../../../store/features/dashboardModule/actions/topDevicesClickAction";
import BackButton from "../../../components/backButton";
function InventoryDetail() {
  const [apicData, setApicData] = useState();
  const [apicDataPerHour, setApicDataPerHour] = useState();
  const [throughput, setThroughput] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  const { state } = location;
  const TopDevicesData = useSelector(
    (state) => state.topDevicesPowerCostClickData?.data?.data
  );
  const isLoading = useSelector(
    (state) => state.topDevicesPowerCostClickData?.loading
  );

  const containerStyle = {
    position: "relative",
    paddingRight: "150px",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    right: "20",
  };

  const deviceTraffic = async () => {
    const payload = {
      apic_controller_ip: data?.device_ip || state?.ip,
    };
    try {
      const res = await axios.post(BaseUrl + `/devicetrafficperhr`, payload);
      setThroughput(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const ApicDataPerHour = async () => {
    const payload = {
      apic_controller_ip: data?.device_ip || state?.ip,
    };
    try {
      const response = await axios.post(BaseUrl + `/devicePowerperhr`, payload);
      setApicDataPerHour(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPowerUtilization = async () => {
    try {
      const res = await axios.post(
        BaseUrl +
          `/device_inventory/deviceLastPowerUtiization?apic_api=${
            data?.device_ip || state?.ip
          }`
      );

      setApicData(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    dispatch(fetchTopDevicesClickData(state?.ip));

    getPowerUtilization();
    ApicDataPerHour();
    deviceTraffic();
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
        {label == "Power Input" ? "W" : label == "Estimated Cost" ? "AED" : ""}
      </div>
    </div>
  );
  const conicColors = {
    "0%": "#6DD4B1",
    "50%": "#4D71EC",
    "100%": "#6DD4B1",
  };
  const strokeColors = {
    "0%": "#29E5B8",
    "50%": "#074F84",
    "100%": "#29E5B8",
  };

  return (
    <>
      <BackButton
        style={{ marginLeft: "15px", margin: "10px 15px" }}
      ></BackButton>

      <div
        className="inventory_detail_container"
        style={{
          color: "#e5e5e5",
          fontSize: "15px",
          width: "94.3%",
          margin: "0 auto",
          height: "auto",
          border: "1px solid #36424E",
          borderRadius: "4px",
          padding: "10px 20px 10px 20px",
          background: "#050C17",
        }}
      >
        <div
          style={{
            height: "85%",
            padding: "0 5px 0 5px",
          }}
        >
          <Row>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Device Name"
                value={data?.device_name || TopDevicesData?.device_name}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Device IP"
                value={data?.device_ip || TopDevicesData?.device_ip}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Device Serial Number"
                value={data?.serial_number || TopDevicesData?.serial_number}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Model Number"
                value={data?.pn_code || TopDevicesData?.pn_code}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Site Name"
                value={data?.site_name || TopDevicesData?.site_name}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Rack Name"
                value={data?.rack_name || TopDevicesData?.rack_name}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Department"
                value={data?.department || TopDevicesData?.department}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Domain"
                value={data?.cisco_domain || TopDevicesData?.cisco_domain}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Software Version"
                value={
                  data?.software_version || TopDevicesData?.software_version
                }
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="RU"
                value={data?.device_ru || TopDevicesData?.device_ru}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Life External Announcement"
                value={data?.hw_eol_ad || TopDevicesData?.hw_eol_ad}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Sale"
                value={data?.hw_eos || TopDevicesData?.hw_eos}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Software Maintenance Release"
                value={data?.sw_EoSWM || TopDevicesData?.sw_EoSWM}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Routine Failure Analysis"
                value={data?.hw_EoRFA || TopDevicesData?.hw_EoRFA}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Vulnerability/Security Support"
                value={data?.sw_EoVSS || TopDevicesData?.sw_EoVSS}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="End of Service Contract Renewal"
                value={data?.hw_EoSCR || TopDevicesData?.hw_EoSCR}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Last Date of Support"
                value={data?.hw_ldos || TopDevicesData?.hw_ldos}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="HardwarecVersion"
                value={
                  data?.hardware_version || TopDevicesData?.hardware_version
                }
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Manufacturer"
                value={data?.manufacturer || TopDevicesData?.manufacturer}
              />
            </Col>

            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Section"
                value={data?.section || TopDevicesData?.section}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Power Input"
                value={data?.power_input || TopDevicesData?.power_input}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              lg={4}
              style={{ padding: "0 10px 10px 10px" }}
              className="columns"
            >
              <LabelledValue
                label="Estimated Cost"
                value={data?.cost || TopDevicesData?.cost}
              />
            </Col>

            <Col
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
                  width: "100%",
                  paddingLeft: "10px",
                }}
              >
                <label htmlFor="" style={{ color: "#B9B9B9" }}>
                  Energy Efficiency
                </label>

                <Progress
                  style={{ marginBottom: "0px", marginTop: "10px" }}
                  size={[250, 30]}
                  trailColor="#16212A"
                  strokeColor={
                    data?.power_utilization < 50
                      ? "#d91c07"
                      : data?.power_utilization > 50 &&
                        data?.power_utilization < 85
                      ? "#0490E7"
                      : "#4C791B"
                  }
                  percent={
                    data?.power_utilization || TopDevicesData?.power_utilization
                  }
                  format={(percent) => (
                    <span style={{ color: "#B9B9B9" }}>{`${percent}%`}</span>
                  )}
                  status="active"
                  gapDegree={0}
                />
              </div>
            </Col>
            <Col
              xs={24}
              md={12}
              lg={6}
              style={{
                padding: "0px 40px 0 10px",
              }}
            >
              <div
                style={{
                  marginBottom: "0px",
                  paddingTop: "10px",
                  width: "100%",
                }}
              >
                <label htmlFor="" style={{ color: "#B9B9B9" }}>
                  Power Utilization Efficiency
                </label>
                <Progress
                  style={{ marginBottom: "0px", marginTop: "5px" }}
                  size={["100%", 35]}
                  trailColor="#16212A"
                  strokeColor={
                    data?.pue >= 85
                      ? "#d91c07"
                      : data?.pue > 50 && data?.pue < 85
                      ? "#0490E7"
                      : data?.pue < 50
                      ? "green"
                      : ""
                  }
                  percent={data?.pue}
                  format={(percent) => (
                    <span style={{ color: "#B9B9B9" }}>{`${percent}%`}</span>
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
              style={{ padding: "10px 10px 10px 10px" }}
              className="columns"
            >
              <div style={{ paddingLeft: "10px" }}>
                <label
                  style={{ fontSize: "12px", color: "#B9B9B9d" }}
                  htmlFor=""
                >
                  Status
                </label>
                <div
                  style={{
                    marginTop: "10px",
                    background: "#71B62633",
                    color: "#C8FF8C",
                    width: "96px",
                    height: "30px",
                    borderRadius: "24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  {data?.status || TopDevicesData?.status}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div
        style={{
          color: "#e5e5e5",
          padding: "10px 10px 0 10px",
        }}
      >
        <Row>
          <Col xs={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                border: "1px solid #36424E",
                borderRadius: "4px",
                height: "240px",
                marginBottom: "20px",
                background: "#050C17",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#E5E5E5",
                  paddingLeft: "20px",
                  marginBottom: "0px",
                }}
              >
                Energy Efficiency
                <span
                  style={{
                    marginLeft: "5px",
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                >
                  (Hourly)
                </span>
              </p>

              <EChartsGauge
                data={apicData ? apicData[0]?.power_utilization : 0}
              />
            </div>
            <div
              style={{
                border: "1px solid #36424E",
                borderRadius: "4px",
                height: "277px",
                background: "#050C17",
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
                Device Data Traffic (24hrs)
              </p>
              <PowerUtilizationChart
                dataa={throughput}
                isByteRate="true"
                style={{
                  margin: "auto",
                  display: "block",
                  maxWidth: "100%",
                  bottom: "9%",
                  height: "240px",
                }}
              />
            </div>
          </Col>
          <Col xs={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                position: "relative",
                border: "1px solid #36424E",
                borderRadius: "4px",
                padding: "20px 0 40px 100px",
                height: "478px",
                // overflowY: "auto",
                background: "#050C17",
              }}
            >
              <img src={device} width={210} height={500} />
            </div>
          </Col>
        </Row>
      </div>

      <div
        style={{
          padding: "0 10px 0 10px",
          height: 360,
        }}
      >
        <Row>
          <Col xs={24} lg={24} style={{ padding: "10px" }}>
            <div
              style={{
                border: "1px solid #36424E",
                borderRadius: "4px",
                height: "300px",
                background: "#050C17",
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
      </div>
    </>
  );
}

export default InventoryDetail;
