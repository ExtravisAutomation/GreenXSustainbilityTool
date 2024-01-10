import React, { useEffect } from "react";
import * as echarts from "echarts/core";
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BrushComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BrushComponent,
  BarChart,
  CanvasRenderer,
]);

const MonthlyCostInternalChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);
    let option;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
    ];

    // Generate random data for two bars for each month
    let data1 = [20, 15, 22, 20, 30, 20, 22, 30, 20, 20, 15, 20, 0]; // Energy Utilization A
    let data2 = [25, 20, 25, 25, 35, 25, 25, 35, 25, 25, 20, 22, 35]; // Energy Utilization B (2023 actual)
    let data3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36]; // Energy Utilization B (2023 actual)

    // Generate predictive data for December 2023
    const predictiveDataDec2023 = Math.round(data2[12] * 1.2); // Assuming a 20% increase for prediction

    // Set the predictive data for December 2023
    data3[12] = predictiveDataDec2023;

    // const updatedData = data1.some((data) => data == 35);

    // console.log(updatedData);

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: "rgba(0,0,0,0.3)",
      },
    };

    option = {
      title: {
        textStyle: {
          color: "#e5e5e5",
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      legend: {
        data: [
          { name: "Energy Utilization 2022", textStyle: { color: "#e5e5e5" } },
          { name: "Energy Utilization 2023", textStyle: { color: "#e5e5e5" } },
        ], // Legend for the two bars with color customization
      },
      brush: {
        toolbox: ["rect", "polygon", "lineX", "lineY", "keep", "clear"],
        xAxisIndex: 0,
      },
      toolbox: {
        show: false,
      },
      tooltip: {
        textStyle: {
          // color: "#e5e5e5",
          color: "grey",
        },
      },
      xAxis: {
        data: monthNames, // Display month names in the xAxis
        name: "Month",
        axisLine: { onZero: true, lineStyle: { color: "#e5e5e5" } },
        splitLine: { show: false },
        splitArea: { show: false },
        axisLabel: {
          color: "#e5e5e5",
        },
      },
      yAxis: {
        name: "Energy Utilization / Month",
        type: "value",
        position: "left",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#e5e5e5",
            width: 1,
            type: "solid",
          },
        },
        axisLabel: {
          formatter: (value) => `${value} kW/M`, // Format the y-axis label to display kWh
          color: "#e5e5e5",
        },
        splitLine: { show: false },
        nameGap: 25,
        left: "10",
        // max: 100, // Uncomment this line if you want to set a maximum limit for y-axis
      },
      grid: {
        bottom: 150, // Increase the bottom padding
      },

      series: [
        {
          name: "Energy Utilization 2022",

          type: "bar",
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: (params) =>
              params.dataIndex === 12 ? "#01A5DE" : "#1dec5b",
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
          data: data1,
        },
        {
          name: "Energy Utilization 2023",

          type: "bar",
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: (params) =>
              // params.dataIndex === 12 ? "#01A5DE" : "#1dec5b",
              params.dataIndex === 12 ? "#01A5DE" : "#01A5DE",

            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
          data: data2,
        },
        {
          name: "Energy Utilization 2024",
          type: "bar",
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          data: data3,
          label: {
            show: true,
            position: "insideTop",
            formatter: (params) => {
              if (params.dataIndex === 12) {
                return "Predictive Energy for January 2024";
              } else {
                return "";
              }
            },
            textStyle: {
              color: "#e5e5e5",
            },
          },
          itemStyle: {
            color: (params) => {
              // Check if it is the predictive data for December 2023
              return params.dataIndex === 12 ? "#FF5722" : "#01A5DE";
            },
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  return <div id="main" style={{ width: "100%", height: "500px" }} />;
};

export default MonthlyCostInternalChart;
