import React, { useEffect, useState } from "react";
import { Row, Col, Progress } from "antd";
const SeedDetails = (data = data.data) => {
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
  console.log(data, "satatatatat");

  return (
    <div
      style={{
        height: "85%",
        padding: "0 30px 0 5px",
      }}
    >
      <Row>
        {/* <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Site" value={data.data.site} color="#0490E7" />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Rack" value={data.data.rack} color="#0490E7" />
        </Col> */}
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Device Name" value={data.data.name} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Address" value={data.data.address} />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Device IP"
            value={data.data.apic_controller_ip}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Delayed Heart Beat"
            value={data.data.delayed_heartbeat}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Device Serial Number"
            value={data.data.serial}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="ID" value={data.data.id} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Last State_mod_ts"
            value={data.data.last_state_mod_ts}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="mod_ts" value={data.data.mod_ts} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="model" value={data.data.model} />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="node" value={data.data.node} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="pod" value={data.data.pod} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue color="#0490E7" label="Role" value={data.data.role} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Vendor" value={data.data.vendor} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Software Version" value={data.data.version} />
        </Col>
        {/* <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="RU" value={data.data.RU} />
        </Col> */}

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="End Of HW Life"
            value={data.data.end_of_hw_life}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="End Of HW Sale"
            value={data.data.end_of_hw_sale}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="End Of SW Life"
            value={data.data.end_of_sw_life}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="End Of SW Sale"
            value={data.data.end_of_sw_sale}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Hardware Version"
            value={data.data.hardware_version}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Manufacturer" value={data.data.manufacturer} />
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="Modified Date" value={data.data.modifiedDate} />
        </Col> */}
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Onboarding Date"
            value={data.data.onboarding_date}
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue label="PN Code" value={data.data.pn_code} />
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Total Traffic Throughput"
            value={data.data.endOfSWLife}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} style={{ padding: "10px" }}>
          <LabelledValue
            label="Co2 Foot Prints"
            value={data.data.co2Footprints}
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
              size={[220, 40]}
              trailColor="#16212A"
              strokeColor={"#4C791B"}
              percent={data.data?.power_utilization}
              format={(percent) => (
                <span style={{ color: "#B9B9B9" }}>{`${percent}%`}</span>
              )}
              status="active"
              gapDegree={0}
            />
          </div>
        </Col> */}
      </Row>
      {/* <div style={{ paddingLeft: "20px" }}>
        <label style={{ fontSize: "12px", color: "#B9B9B9" }} htmlFor="">
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
          {data.data.fabric_status}
        </div>
      </div> */}
    </div>
  );
};

export default SeedDetails;
