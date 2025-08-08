import React, { useEffect, useContext } from "react";
import * as echarts from "echarts";
import { useTheme } from "@mui/material/styles";
import { AppContext } from "../context/appContext";

const RealTimePowerConsuptionChart = ({ data, dashboard }) => {
  const theme = useTheme();
  const { isDarkMode, setDarkMode } = useContext(AppContext);

  useEffect(() => {
    const chartDom = document.getElementById("real");
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "24 hour Storage Usage Overview for Virtual Machine",
        textStyle: {
          fontSize: 16,
          color: theme?.palette?.default_card?.color,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "12%",
        top: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: theme?.palette?.default_card?.background,
        borderColor: theme?.palette?.default_card?.border,
        textStyle: {
          // Custom text style
          color: theme?.palette?.default_card?.color,
          fontSize: 14, // Text size
          fontFamily: "Arial, sans-serif", // Font family
          fontWeight: "bold", // Font weight
          lineHeight: 1.5, // Line height
        },
        formatter: function (params) {
          console.log(params, "params");
          const time = params[0]?.axisValueLabel;
          let tooltipContent = `<div >Time:${time}</div>`;
          params.forEach((item) => {
            tooltipContent += `<div>Usage: ${item.data} GB</div>`;
          });
          return tooltipContent;
        },
      },
      xAxis: {
        type: "category",

        // data: data.data.data?.map((data) => data.hour),
        data:
          dashboard == "true"
            ? data?.map((data) => {
                const hour = new Date(data.hour).getHours();
                return `${hour < 10 ? "0" : ""}${hour}:00`;
              })
            : data.data?.map((data) => {
                const hour = new Date(data.hour).getHours();
                return `${hour < 10 ? "0" : ""}${hour}:00`;
              }),
        splitLine: {
          show: true, // Show split lines
          lineStyle: {
            color: "#151A20", // Set color of split lines
            type: "solid", // Set type of split lines (solid, dashed, or dotted)
          },
        },
        axisLabel: {
          textStyle: {
            color: "#979797", // Change the color of text on the x-axis
            fontSize: "15px",
          },
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false, // Show split lines
        },
        axisLabel: {
          textStyle: {
            color: "#979797", // Change the color of text on the x-axis
            fontSize: "15px",
          },
          formatter: function (value) {
            return dashboard == "true" ? value + "KW" : value + "GB"; // Display values in kilo format
          },
        },
      },
      series: [
        {
          data:
            dashboard == "true"
              ? data?.map((data) => data?.used_space_GB)
              : data.data?.map((data) => data.used_space_GB),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#2268D1",
            // width: 4,
            // shadowColor: "#2268D1",
            // shadowBlur: 2,
            // shadowOffsetY: 10,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#27648a75",
              },
              {
                offset: 1,
                color: "#2c3f4b1d",
              },
            ]),
          },
        },
      ],
    };

    // Set chart options
    option && myChart.setOption(option);

    // Cleanup function
    return () => {
      // Dispose of the ECharts instance to avoid memory leaks
      myChart.dispose();
    };
  }, [data, isDarkMode]);

  return <div id="real" style={{ width: "100%", height: "250px" }}></div>;
};

export default RealTimePowerConsuptionChart;
