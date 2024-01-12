import React, { useEffect } from "react";
import * as echarts from "echarts";
import Typography from "antd/es/typography/Typography";

const HardwareLifeCycle = ({ chartData }) => {
  useEffect(() => {
    const chartDom = document.getElementById("hardware-life-cycle-chart");
    const myChart = echarts.init(chartDom);

    const total = chartData.reduce((acc, item) => acc + item.value, 0);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)<br/>Total: " + total + " (out of 3000)",
      },
      legend: {
        orient: "horizontal",
        bottom: 5,
        textStyle: {
          color: "#e5e5e5",
        },
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: "70%",
          data: chartData,
          color: ["#CC4C24", "#E1931E", "#4C69B5"], // Specify colors here
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            show: total > 3000, // Show labels only when the total is greater than 3000
            formatter: function (params) {
              // Customize the label text based on conditions
              if (total > 3000) {
                return `{b}: {c} ({d}%)`;
              } else {
                return '';
              }
            },
            textStyle: {
              color: "#e5e5e5",
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  return (
    <>
     <Typography
        variant="h6"
        style={{
          color: "white",
          marginLeft: 15,
          marginTop: 15,
          fontSize: "1.25rem",
          fontWeight: "500",
          lineHeight: "20px",
        }}
      >
       Hardware Lifecycle{" "}
      </Typography>

      <div
        id="hardware-life-cycle-chart"
        style={{ width: "100%", height: "350px" }}
      />
    </>
  );
};

export default HardwareLifeCycle;
