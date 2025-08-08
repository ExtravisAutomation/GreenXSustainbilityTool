import React from "react";
import { Progress } from "antd";
import { useTheme } from "@mui/material/styles";

const CustomTooltip = ({ visible, position, data }) => {
  const theme = useTheme();

  if (!visible || !data) return null;

  function getProgressColor(percent) {
    if (percent > 85) {
      return "#5CA413"; // Red for high utilization (> 80%)
    } else if (percent > 50) {
      return "#6495ED"; // Blue for moderate utilization (50% - 80%)
    } else {
      return "#c4101e"; // Green for low utilization (<= 50%)
    }
  }

  function getProgressColor2(percent) {
    if (percent > 85) {
      return "#5CA413"; // Red for high utilization (> 80%)
    } else if (percent > 50) {
      return "#6495ED"; // Blue for moderate utilization (50% - 80%)
    } else {
      return "#c4101e"; // Green for low utilization (<= 50%)
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        // left: position.x + 20,
        // top: position.y + 20,
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
        padding: "20px",
        borderRadius: "4px",
        color: theme?.palette?.main_layout?.primary_text,
        zIndex: 1000,
        // height: "100vh",
        bottom: "100px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <strong>Site:</strong>{" "}
        <span style={{ color: "#0e50c9" }}> {data.name}</span>
      </div>
      {/* <div style={{ marginBottom: "20px" }}>
        <strong>Country:</strong> {data.name}
      </div> */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Energy Consumption:</strong>
        <Progress
          percent={data.energy}
          //   size="large"
          size={[150, 20]}
          trailColor="#16212A"
          //   strokeColor={data.color}
          strokeColor={getProgressColor(data.energy)}
          style={{
            width: "150px",
            display: "inline-block",
            marginLeft: "70px",
          }}
        />
        {data.energy}%
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          margin: "20px 20px 20px 0",
        }}
      >
        <strong>CO2 Emmision:</strong>
        <div>
          <Progress
            percent={data.co2}
            //   size="large"
            size={[150, 20]}
            trailColor="#16212A"
            // strokeColor={data.color}
            strokeColor={getProgressColor2(data.co2)}
            style={{
              width: "150px",
              display: "inline-block",
              marginLeft: "20px",
            }}
            format={(percent) => (
              <span
                style={{
                  color: theme?.palette?.main_layout?.primary_text,
                  //   fontSize: table == "true" ? "11px" : "14px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {data.co2}KG
              </span>
            )}
          />
          {/* {data.co2}KG */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Longitude:</strong> {data.longitude}
        </div>
        <div>
          <strong>Latitude:</strong> {data.latitude}
        </div>

        <div>
          <strong>Cost:</strong>{" "}
          <span style={{ color: "#0e50c9" }}>AED {data.cost}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
