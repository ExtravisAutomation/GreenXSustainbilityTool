import React, { useEffect, useState } from "react";
import { Row, Col, Progress } from "antd";
const ViewSiteDetail = (data = data.data) => {
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
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue
            label="Site Name"
            value={data.data.site_name}
            color="#0490E7"
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Site Type" value={data.data.site_type} />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Country" value={data.data.region} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="City" value={data.data.city} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Latitude" value={data.data.latitude} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Longitude" value={data.data.longitude} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue
            label="Total Devices"
            value={data.data.total_devices}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <div style={{ padding: "10px" }}>
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
              {data.data.status}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewSiteDetail;
