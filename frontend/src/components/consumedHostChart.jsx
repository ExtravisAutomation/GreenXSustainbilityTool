import React from "react";
import ReactEcharts from "echarts-for-react"; // Make sure to install echarts-for-react package
import { useTheme } from "@mui/material/styles";

const ConsumedHostChart = ({ data, host }) => {
  const theme = useTheme();

  const option = {
    title: {
      text:
        host == "true"
          ? "Performance Summary (24 hours)"
          : "Consumed Host CPU / Memory",
      textStyle: {
        fontSize: 16, // Adjust the font size of legend texts
        color: theme?.palette?.default_card?.color,
      },
    },
    grid: {
      left: "4%",
      right: "6%",
      bottom: "0%",
      top: "20%",
      containLabel: true,
    },
    // tooltip: {
    //   trigger: "axis",
    // },
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
        let tooltipContent = `<div >Time: ${params[0].axisValueLabel}</div>`;
        params.forEach((item) => {
          if (
            item.seriesName == "Consumed Host CPU" ||
            item.seriesName == "Energy Efficiency"
          ) {
            const efficiencyLabel =
              item.data < 50 && item.seriesName == "Energy Efficiency"
                ? '<span style="color: #e00b24;">(Less Efficient)</span>'
                : item.data >= 50 &&
                  item.data < 80 &&
                  item.seriesName == "Energy Efficiency"
                ? '<span style="color: blue;">(Moderate)</span>'
                : item.data > 80 && item.seriesName == "Energy Efficiency"
                ? '<span style="color: green;">(Efficient)</span>'
                : "";

            tooltipContent += `<div>${item.seriesName}: ${item.data}% ${efficiencyLabel}</div>`;
          } else {
            tooltipContent += `<div>${item.seriesName}: ${item.data} GB</div>`;
          }
        });
        return tooltipContent;
      },
    },
    legend: {
      right: 20,
      icon: "circle",
      itemGap: 20, // Adjust the gap between legend items
      textStyle: {
        fontSize: 15, // Adjust the font size of legend texts
        color: theme?.palette?.default_card?.color,
        fontWeight: "500",
      },
    },
    toolbox: false,
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data?.map((item) => item.hour),
      splitLine: {
        show: true,
        lineStyle: {
          color: theme?.palette?.graph?.line_color,
          type: "solid",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        // name: "Consumed Host CPU (%)",
        position: "left",
        axisLabel: {
          formatter: "{value}",
        },
        splitLine: {
          show: false, // Show split lines
          lineStyle: {
            color: "#151A20", // Set color of split lines
            type: "solid", // Set type of split lines (solid, dashed, or dotted)
          },
        },
      },
      {
        type: "value",
        name: "Consumed Host Memory (GB)",
        position: "right",
        axisLabel: {
          formatter: "{value}",
        },
        splitLine: {
          show: false, // Show split lines
          lineStyle: {
            color: "#151A20", // Set color of split lines
            type: "solid", // Set type of split lines (solid, dashed, or dotted)
          },
        },
        nameLocation: "middle", // Place the name in the middle
        nameGap: 45, // Adjust the gap between the axis and the name
        nameRotate: 270, // Rotate the name vertically
        nameTextStyle: {
          verticalAlign: "middle", // Align vertically
          align: "center", // Align horizontally
        },
      },
    ],
    series: [
      {
        name: "Consumed Host CPU",
        type: "line",
        data: data?.map((item) => item.cpu_usage_percent),
        yAxisIndex: 0, // Use the first y-axis
        itemStyle: {
          color: "#58D779", // Custom color for Consumed Host CPU
        },
      },
      // {
      //   name: "Energy Efficiency",
      //   type: "line",
      //   data: data?.map((item) => item.eer),
      //   yAxisIndex: 0, // Use the first y-axis
      //   itemStyle: {
      //     color: "#f2a407", // Custom color for Consumed Host CPU
      //   },
      // },
      {
        name: "Consumed Host Memory",
        type: "line",
        data: data?.map((item) => item.mem_usage_gb),

        yAxisIndex: 1, // Use the second y-axis
        itemStyle: {
          color: "#4C69B5", // Custom color for Consumed Host Memory
        },
      },
    ],
  };

  return (
    <ReactEcharts option={option} style={{ height: "300px", width: "100%" }} />
  );
};

export default ConsumedHostChart;
