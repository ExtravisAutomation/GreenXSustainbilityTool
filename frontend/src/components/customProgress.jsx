import React from "react";
import { Progress } from "antd";
import { useTheme } from "@mui/material/styles";

const CustomProgress = ({
  style,
  children,
  percent,
  type,
  strokeWidth,
  size,
  conicColors,
  table,
  name,
  memory,
  graphValue,
  pueValue,
  pue,
  report,
}) => {
  const theme = useTheme();

  const getStrokeColor = (percent) => {
    if (percent < 1.5) {
      return "green"; // Green zone
    } else if (percent < 2.0) {
      return "yellow"; // Yellow zone
    } else {
      return "red"; // Red zone
    }
  };
  const updatedPueValue = (pueValue / 2) * 100;
  const strokeColor = getStrokeColor(pueValue);
  return (
    <>
      {!type ? (
        <p
          style={{
            fontSize: "12px",
            color: "#FFFFFF",
            marginBottom: "0px",
            marginTop: "21.5px",
          }}
        >
          {name}
        </p>
      ) : null}
      <Progress
        type={type}
        percent={pue == "true" ? updatedPueValue : percent}
        size={size}
        strokeColor={pue == "true" ? strokeColor : conicColors}
        strokeWidth={strokeWidth}
        trailColor={report ? "" : theme?.palette?.graph?.trailColor}
        format={(percent) => (
          <span
            style={{
              color: theme?.palette?.main_layout?.primary_text,
              fontSize: table == "true" ? "11px" : "14px",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {memory == "true"
              ? `${graphValue} MB`
              : pue == "true"
              ? pueValue
              : `${percent}%`}
          </span>
        )}
      />
      {type && table !== "true" ? (
        <p
          style={{
            fontSize: "12px",
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          {name}
        </p>
      ) : null}
    </>
  );
};

export default CustomProgress;
