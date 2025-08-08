import React, { useEffect, useContext } from "react";
import { useTheme } from "@mui/material/styles";
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
import { AppContext } from "../context/appContext";

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BrushComponent,
  BarChart,
  CanvasRenderer,
]);

const MonthlyCostInternalChart = ({ data }) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);
    let option;

    const monthNames = data?.months?.map((item) => item);

    // Generate random data for two bars for each month
    // let data1 = [5500, 7000, 6000, 6500, 6000, 7000, 8500, 9000, 10000, 10000];
    let data1 = data?.last_year_power?.map((item) => item);
    // let data2 = [
    //   6000, 8000, 7500, 7000, 6500, 7500, 7400, 10000, 10959.14, 10964.01,
    // ];
    let data2 = data?.current_year_power?.map((item) => item);
    if (data2 && data2.length > 0) {
      data2[data2.length - 1] += 15000;
    }

    // Generate predictive data for December 2023
    // const predictiveDataDec2023 = Math.round(data2[10] * 1.2);

    // Set the predictive data for December 2023
    // data3[12] = predictiveDataDec2023;

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
          color: theme?.palette?.graph?.title,
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      legend: {
        data: [
          {
            name: "Energy Utilization 2023",
            textStyle: {
              color: theme?.palette?.graph?.title,
            },
          },
          {
            name: "Energy Utilization 2024",
            textStyle: {
              color: theme?.palette?.graph?.title,
            },
          },
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
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        textStyle: {
          color: theme?.palette?.graph?.title,
        },
      },
      xAxis: {
        data: monthNames, // Display month names in the xAxis
        name: "Month",
        axisLine: {
          onZero: true,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
          },
        },
        splitLine: { show: false },
        splitArea: { show: false },
        axisLabel: {
          color: theme?.palette?.graph?.title,
        },
      },
      yAxis: {
        // name: "Energy Utilization / Month",
        type: "value",
        position: "left",
        axisLine: {
          show: true,
          lineStyle: {
            color: theme?.palette?.graph?.line_color,
            width: 1,
            type: "solid",
          },
        },
        axisLabel: {
          formatter: (value) => `${value} kW/M`, // Format the y-axis label to display kWh
          color: theme?.palette?.graph?.title,
        },
        splitLine: { show: false },
        nameGap: 25,
        left: "10",
        // max: 100, // Uncomment this line if you want to set a maximum limit for y-axis
      },
      grid: {
        bottom: 10,
        right: 100,
        left: 10,
        containLabel: true,
      },

      series: [
        {
          name: "Energy Utilization 2023",

          type: "bar",
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: "#4C791B",
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
          data: data1,
        },
        {
          name: "Energy Utilization 2024",

          type: "bar",
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: (params) =>
              params.dataIndex === 9
                ? "#2268D1"
                : theme?.palette?.graph?.graph_area?.from_top,
            barBorderRadius: [50, 50, 0, 0],
          },
          data: data2,
          label: {
            show: true,
            position: "insideTop",
            formatter: (params) => {
              if (params.dataIndex === data2?.length - 1) {
                return "Predictive Energy for December 2024";
              } else {
                return "";
              }
            },
            textStyle: {
              color: theme?.palette?.graph?.title,
            },
          },
          itemStyle: {
            color: (params) => {
              console.log("params for predictive", params);

              // Check if it is the predictive data for December 2023
              return params.dataIndex === data2?.length - 1
                ? "#FF5722"
                : theme?.palette?.graph?.graph_area?.from_top;
            },
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
        },
        // {
        //   name: "Energy Utilization 2024",
        //   type: "bar",
        //   barWidth: 10, // Set the width of the bars
        //   emphasis: emphasisStyle,
        //   data: data3,
        //   label: {
        //     show: true,
        //     position: "insideTop",
        //     formatter: (params) => {
        //       if (params.dataIndex === 12) {
        //         return "Predictive Energy for January 2024";
        //       } else {
        //         return "";
        //       }
        //     },
        //     textStyle: {
        //       color: "#e5e5e5",
        //     },
        //   },
        //   itemStyle: {
        //     color: (params) => {
        //       // Check if it is the predictive data for December 2023
        //       return params.dataIndex === 12 ? "#FF5722" : "#01A5DE";
        //     },
        //     barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
        //   },
        // },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [data, themeMode]);

  return <div id="main" style={{ width: "100%", height: "270px" }} />;
};

export default MonthlyCostInternalChart;
