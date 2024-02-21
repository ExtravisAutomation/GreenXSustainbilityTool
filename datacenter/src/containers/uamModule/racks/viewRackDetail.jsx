import React, { useEffect, useState } from "react";
import { Row, Col, Progress } from "antd";
const ViewRackDetail = (data = data.data) => {
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
            label="Rack Name"
            value={data.data.rack_name}
            color="#0490E7"
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue
            label="Site Name"
            value={data.data.site_name}
            color="#0490E7"
          />
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Rack Model" value={data.data.rack_model} />
        </Col> */}

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Serial" value={data.data.serial_number} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue
            label="Manufacture Date"
            value={data.data.manufacture_date}
          />
        </Col>
        {/* <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="RFS" value={data.data.RFS} />
        </Col> */}
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Width" value={data.data.Width} />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Height" value={data.data.Height} />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Depth" value={data.data.Depth} />
        </Col>

        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Ru" value={data.data.Ru} />
        </Col>
        {/* <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Tag id" value={data.data.Tag_id} />
        </Col> */}

        {/* <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="PN Code" value={data.data.pn_code} />
        </Col> */}
        <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue label="Floor" value={data.data.floor} />
        </Col>

        {/* <Col xs={24} sm={12} md={8} lg={8} style={{ padding: "10px" }}>
          <LabelledValue
            label="Total Devices"
            value={data.data.total_devices}
          />
        </Col> */}
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

export default ViewRackDetail;
