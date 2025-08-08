import React, { useEffect, useState } from "react";
import axios from "axios";
// import { baseUrl } from "../../../utils/axios";
import { baseUrl } from "../utils/axios";
const DevicesCommonTable = ({
  topDevicesUnit,
  throughputUnit,
  heading,
  topDevices,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          border: "1px solid #36424E",
          flexBasis: "48%",
          borderRadius: "7px",
          color: "white",
        }}
      >
        <p style={{ fontWeight: "bold", padding: "0px 20px" }}>{heading}</p>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              alignItems: "center",
              justifyContent: "start",
              padding: "0px 20px",
              border: "1px solid #36424E",
              flexBasis: "50%",
              height: "44px",
            }}
          >
            Name
          </div>
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              alignItems: "center",
              justifyContent: "start",
              padding: "0px 20px",
              border: "1px solid #36424E",
              flexBasis: "50%",
              height: "44px",
            }}
          >
            {topDevicesUnit ? topDevicesUnit : throughputUnit}
          </div>
        </div>
        {topDevices.map((data) => (
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                fontWeight: "500",
                alignItems: "center",
                justifyContent: "start",
                padding: "0px 20px",
                border: "1px solid #36424E",
                flexBasis: "50%",
                height: "44px",
                color: "#0490E7",
              }}
            >
              {data.name}
            </div>
            <div
              style={{
                display: "flex",
                fontWeight: "500",
                alignItems: "center",
                justifyContent: "start",
                padding: "0px 20px",
                border: "1px solid #36424E",
                flexBasis: "50%",
                height: "44px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#4C791B",
                  padding: "3px 8px",
                  borderRadius: "7px",
                }}
              >
                {data.power_utilization}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DevicesCommonTable;
