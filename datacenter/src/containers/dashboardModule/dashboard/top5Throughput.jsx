import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
const TopThroughput = () => {
  const [topDevices, setTopDevices] = useState([]);

  const getTopFabricNodes = async () => {
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${baseUrl}/apic/top-fabric-nodes-drawn-last`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Handle response data as needed
      console.log(response, "ttttt throughput");
      setTopDevices(response.data);
    } catch (error) {
      // Handle error
      console.error("Error fetching top fabric nodes:", error);
    }
  };

  useEffect(() => {
    getTopFabricNodes();
  }, []);
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
        }}
      >
        <p style={{ fontWeight: "bold", padding: "0px 20px" }}>
          Top 5 Devices Traffic Throughput
        </p>
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
            W/24h
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

export default TopThroughput;
