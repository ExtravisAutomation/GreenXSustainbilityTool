import React, { useEffect } from "react";
import * as echarts from "echarts";

const PucPiChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("puc");
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "5%",
        left: "center",
        textStyle: {
          fontSize: 10, // Adjust the font size of legend texts
          color: "#E4E5E8", // Set legend text color
        },
        itemStyle: {
          borderRadius: "100%", // Set the border radius to make icons rounded
        },
      },
      series: [
        {
          name: "Average Power Consumption",
          type: "pie",
          radius: ["48%", "60%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "inside",
            formatter: "{d}",
            color: "#FFFFFF",
            fontSize: "16px",
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFFFFF",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 80, name: "Device 1", itemStyle: { color: "#2268D1" } },
            { value: 15, name: "Device 2", itemStyle: { color: "#C8CFDA" } },
            { value: 20, name: "Device 3", itemStyle: { color: "#ACB6C6" } },
            { value: 20, name: "Device 4", itemStyle: { color: "#7A8CA6" } },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    // Clean up
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="puc" style={{ width: "100%", height: "300px" }}></div>;
};

export default PucPiChart;
