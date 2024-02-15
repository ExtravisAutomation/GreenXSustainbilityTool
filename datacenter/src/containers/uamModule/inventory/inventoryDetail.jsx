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

import { BackwardOutlined } from "@ant-design/icons";
import { green } from "@mui/material/colors";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
function InventoryDetail() {
  const [apicData, setApicData] = useState();
  const [apicDataPerHour, setApicDataPerHour] = useState();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  console.log(data, "data");

  const containerStyle = {
    position: "relative",
    paddingRight: "150px",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    right: "20",
  };

  const getPowerUtilization = async () => {
    const access_token = localStorage.getItem("access_token");

    const payload = {
      apic_controller_ip: data.apic_controller_ip,
      node: data.node,
    };
    const res = await axios.post(
      baseUrl + "/apic/power-utilization-5min",
      payload,
      // {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(res.data, "res apic min");
    const response = await axios.post(
      baseUrl + "/apic/power-utilization-per-hour",
      payload,
      // {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    setApicData(res.data);
    setApicDataPerHour(response.data);
  };
  useEffect(() => {
    getPowerUtilization();
  }, []);
  // console.log(apicData, "apic data");
  // console.log(apicDataPerHour, "apic data per hour");

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
          fontSize: "12",
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
          background: "#16212A",
          color: color ? "#0490E7" : "white",
          fontSize: "12px",
          fontWeight: 500,
          paddingLeft: "10px",
          marginBottom: "0px",
        }}
      >
        {value}
      </div>
    </div>
  );
  const conicColors = {
    "0%": "#6DD4B1",
    "50%": "#4D71EC",
    "100%": "#6DD4B1",
  };

  const nameWithoutSuffix = data.name.slice(0, data.name.lastIndexOf("-"));

  return (
    <>
      <Button
        style={{
          marginTop: "20px",
          marginLeft: "1px",
          background: "transparent",
          color: "#E4E4E4",
          border: "unset",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
        onClick={() => navigate(-1)}
      >
        <BackwardOutlined />
        <p style={{ marginTop: "16.5px" }}>Seeds</p>
      </Button>
      <div
        style={{
          color: "#e5e5e5",
          padding: "10px 10px 0 10px",
        }}
      >
        <Row>
          <Col sm={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                color: "#e5e5e5",
                fontSize: "15px",
                // width: "100%",
                height: "524px",
                border: "1px solid #36424E",
                borderRadius: "7px",
                padding: "10px 20px 10px 20px",
              }}
            >
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Seed Details
              </p>
              <div
                style={{
                  overflowY: "auto",
                  overflowX: "none",
                  height: "85%",
                  padding: "0 30px 0 5px",
                }}
              >
                <Row>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Site"
                      value={data.site}
                      color="#0490E7"
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Rack"
                      value={data.rack}
                      color="#0490E7"
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="Address" value={data.address} />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="Device Name" value={data.name} />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Device IP"
                      value={data.apic_controller_ip}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Delayed Heart Beat"
                      value={data.delayed_heartbeat}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Device Serial Number"
                      value={data.serial}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="ID" value={data.id} />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Last State_mod_ts"
                      value={data.last_state_mod_ts}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="mod_ts" value={data.mod_ts} />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="model" value={data.model} />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="node" value={data.node} />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="pod" value={data.pod} />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      color="#0490E7"
                      label="Role"
                      value={data.role}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="Vendor" value={data.vendor} />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Software Version"
                      value={data.version}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="RU" value={data.RU} />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="End Of HW Life"
                      value={data.endOfHWLife}
                    />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="End Of HW Sale"
                      value={data.deviceName}
                    />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="End Of SW Life"
                      value={data.endOfSWLife}
                    />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="End Of SW Sale"
                      value={data.endOfSWSale}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="HardwarecVersion"
                      value={data.hardwareVersion}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Manufacturer"
                      value={data.manufacturer}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Modified By"
                      value={data.modifiedBy}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Modified Date"
                      value={data.modifiedDate}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Onboarding Date"
                      value={data.onboardingDate}
                    />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue label="PN Code" value={data.pnCode} />
                  </Col>

                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Total Traffic Throughput"
                      value={data.endOfSWLife}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12} style={{ padding: "10px" }}>
                    <LabelledValue
                      label="Co2 Foot Prints"
                      value={data.co2Footprints}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                    lg={12}
                    style={{
                      padding: "10px 0 0 10px",
                    }}
                  >
                    {/* <LabelledValue
                      label="Power Utilization"
                      value={data.powerUtilization}
                    /> */}
                    <div
                      style={{
                        marginBottom: "0px",
                        paddingTop: "10px",
                        width: "100%",
                        paddingLeft: "10px",
                      }}
                    >
                      <label htmlFor="" style={{ color: "#B9B9B9" }}>
                        Power Utilization
                      </label>
                      <Progress
                        style={{ marginBottom: "0px", marginTop: "5px" }}
                        size={[290, 40]}
                        trailColor="#16212A"
                        strokeColor={"#4C791B"}
                        percent={apicData?.power_utilization_5min}
                        format={(percent) => (
                          <span
                            style={{ color: "#B9B9B9" }}
                          >{`${percent}%`}</span>
                        )}
                        status="active"
                        gapDegree={0}
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ paddingLeft: "20px" }}>
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
                      height: "36px",
                      borderRadius: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    {data.fabric_status}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col sm={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                // width: "30%",
                position: "relative",
                border: "1px solid #36424E",
                borderRadius: "7px",
                padding: "20px",
              }}
            >
              <img src={device} width={250} height={500} />
            </div>
          </Col>
        </Row>
      </div>

      <div
        style={{
          padding: "0 10px 0 10px",
          minHeight: 360,
        }}
      >
        {/* <Row>
          <Col md={12} style={{ padding: "5px 5px 5px 0px" }}>
            <div
              style={{
                color: "white",
                padding: "10px 30px",
                border: "1px solid #36424E",
                background: "#050C17",
                borderRadius: "7px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginBottom: "40px",
                }}
              >
                Input Power
              </p>
              <div style={{ marginBottom: "50px", marginTop: "40px" }}>
                <p>Device 69</p>
                <Progress
                  steps={40}
                  percent={70}
                  size={[8, 50]}
                  // strokeColor="gray"
                  trailColor="gray"
                />
              </div>
              <div style={{ marginBottom: "50px" }}>
                <p>Device 69</p>
                <Progress
                  steps={40}
                  percent={70}
                  size={[8, 50]}
                  // strokeColor="gray"
                  trailColor="gray"
                />
              </div>
              <div style={{ marginBottom: "48.5px" }}>
                <p>Device 69</p>
                <Progress
                  steps={40}
                  percent={70}
                  size={[8, 50]}
                  // strokeColor="gray"
                  trailColor="gray"
                />
              </div>
            </div>
          </Col>
          <Col md={12}>
            <Row justify={"space-between"}>
              <Col md={8} style={{ padding: "5px" }}>
                <div
                  style={{
                    padding: "10px 20px",
                    color: "white",
                    border: "1px solid #36424E",
                    background: "#050C17",
                    borderRadius: "7px",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginBottom: "40px",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Required Power
                  </p>
                  <div style={{ marginBottom: "40px", marginTop: "53px" }}>
                    <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                      Device 69
                    </p>
                    <p className="required_power">900 w</p>
                  </div>{" "}
                  <br />
                  <div style={{ marginBottom: "40px" }}>
                    <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                      Device 69
                    </p>
                    <p className="required_power">900 w</p>
                  </div>{" "}
                  <br />
                  <div style={{ marginBottom: "39px" }}>
                    <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                      Device 69
                    </p>
                    <p className="required_power">900 w</p>
                  </div>
                </div>
              </Col>
              <Col md={8} style={{ padding: "5px" }}>
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid #36424E",
                    background: "#050C17",
                    borderRadius: "7px",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginBottom: "40px",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Power Supply Efficiency
                  </p>
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={100}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span
                        style={{
                          color: "#E4E4E4",
                          fontSize: "9.62px",
                          fontWeight: 700,
                        }}
                      >{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                  <br />
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={75}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span style={{ color: "white" }}>{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                  <br />
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={75}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span style={{ color: "white" }}>{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                </div>
              </Col>
              <Col md={8} style={{ padding: "5px" }}>
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid #36424E",
                    background: "#050C17",
                    borderRadius: "7px",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      width: "100%",
                      marginBottom: "40px",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Power Supply Load
                  </p>
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={100}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span style={{ color: "white" }}>{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                  <br />
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={75}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span style={{ color: "white" }}>{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                  <br />
                  <Progress
                    type="dashboard"
                    size={70}
                    percent={75}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    format={(percent) => (
                      <span style={{ color: "white" }}>{`${percent}%`}</span>
                    )}
                  />
                  <p style={{ marginTop: "0px" }}>Device 69</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row> */}
        <Row>
          <Col sm={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                border: "1px solid #36424E",
                borderRadius: "7px",
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
                Device Power Utilization
              </p>
              <div
                style={{
                  padding: "0px",
                }}
              >
                <PowerUtilizationChart dataa={apicDataPerHour} />
              </div>
            </div>
          </Col>
          <Col sm={24} lg={12} style={{ padding: "10px" }}>
            <div
              style={{
                border: "1px solid #36424E",
                borderRadius: "7px",
                height: "488px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#E5E5E5",
                  paddingLeft: "20px",
                }}
              >
                Power Usage
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "50px 0 0px 0",
                }}
              >
                <div>
                  <Progress
                    type="dashboard"
                    size={250}
                    percent={apicData?.power_utilization_5min}
                    trailColor="rgba(35, 35, 35, 0.85)"
                    strokeColor={conicColors}
                    strokeWidth={15}
                    format={(percent) => (
                      <span
                        style={{
                          color: "#E4E4E4",
                          fontSize: "28px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {`${percent}%`}
                        <strong style={{ fontSize: "14px", color: "#B0B0B0" }}>
                          usage
                        </strong>
                      </span>
                    )}
                  />
                  <p
                    style={{
                      marginTop: "0px",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {nameWithoutSuffix}
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default InventoryDetail;
