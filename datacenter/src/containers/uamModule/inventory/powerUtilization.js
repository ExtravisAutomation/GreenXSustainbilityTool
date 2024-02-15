import React from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineMarkSeries,
  LineSeries,
} from "react-vis";
import Plot from "react-plotly.js";

function PowerUtilizationChart({ dataa }) {
  console.log(dataa, "data in graph");

  if (!dataa || !Array.isArray(dataa) || dataa.length === 0) {
    return console.log("no data available");
  }

  const chartData = dataa.map((entry) => {
    // console.log(entry.hour.split(" ")[1], "entries");
    return {
      x: parseInt(entry.hour.split(" ")[1].split(":")[0]),
      y: Math.round(entry.power_utilization * 100) / 100,
    };
  });

  // ====================

  const dummyData = [
    { hour: "2024-02-14 01:00", power_utilization: 25 },
    { hour: "2024-02-14 02:00", power_utilization: 30 },
    { hour: "2024-02-14 03:00", power_utilization: 28 },
    { hour: "2024-02-14 04:00", power_utilization: 32 },
    { hour: "2024-02-14 05:00", power_utilization: 35 },
    { hour: "2024-02-14 06:00", power_utilization: 40 },
    { hour: "2024-02-14 07:00", power_utilization: 45 },
    { hour: "2024-02-14 08:00", power_utilization: 50 },
    { hour: "2024-02-14 09:00", power_utilization: 48 },
    { hour: "2024-02-14 10:00", power_utilization: 42 },
  ];

  const processedData = dataa
    // .filter((point) => point.power_utilization !== null)
    .map((point) => {
      const time = new Date(point.hour);
      return {
        x: time.getHours() + ":" + time.getMinutes(),
        y: point.power_utilization === null ? 0 : point.power_utilization,
      };
    });
  console.log(processedData, "process data");
  const xValues = processedData.map((point) => point.x);
  const yValues = processedData.map((point) => point.y);

  return (
    <>
      {/* <XYPlot width={500} height={300}>
        <XAxis
          style={{
            text: { fill: "#E5E5E5" },
            fontSize: "10px",
          }}
        />
        <YAxis
          style={{
            line: { stroke: "#151A20" },
            text: { fill: "#E5E5E5" },
            fontSize: "8px",
          }}
        />
        <HorizontalGridLines />
        <VerticalGridLines />
        <LineSeries
          data={chartData}
          stroke={"#2f68c6"}
          curve={"curveNatural"}
          strokeWidth={6}
        />
      </XYPlot> */}
      {processedData.length === 0 ? (
        <div
          style={{
            height: "450px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "red" }}>Data is missing to show in graph</p>
        </div>
      ) : (
        <Plot
          data={[
            {
              x: xValues,
              y: yValues,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
              line: { color: "#2f68c6", width: 6, shape: "linear" },
              // hoverinfo: "none",
            },
          ]}
          layout={{
            // title: "Power Utilization over Time",
            xaxis: {
              title: "Time (HH:MM)",
              // range: [0, 24],
              gridcolor: "#151A20",
              color: "#E5E5E5",
            },
            yaxis: {
              title: "Power Utilization (kw)",
              gridcolor: "transparent",
              color: "#E5E5E5",
            },
            paper_bgcolor: "#0D131C",
            width: "auto",
            // height: 300,
            // hovermode: false,
          }}
        />
      )}
    </>
  );
}

export default PowerUtilizationChart;
