import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";
import moment from "moment";

const KpisChart = ({ kpisData, dashboard, report, siteId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const chartDom = document.getElementById("kpis");
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#050C17",
        borderColor: "rgba(185, 185, 185, 0.7)",
        textStyle: {
          // Custom text style
          color: "rgba(185, 185, 185, 0.7)", // Text color
          fontSize: 14, // Text size
          fontFamily: "Arial, sans-serif", // Font family
          fontWeight: "bold", // Font weight
          lineHeight: 1.5, // Line height
        },
        formatter: function (params) {
          const time = params[0]?.axisValueLabel;
          let tooltipContent = `<div >Time:${time}</div>`;

          params.forEach((item) => {
            const efficiencyLabel =
              item.value > 0 &&
              item.value < 50 &&
              item.seriesName == "Energy Efficiency Ratio"
                ? '<span style="color: #e00b24;">(Less Efficient)</span>'
                : item.value > 0 &&
                  item.value < 50 &&
                  item.seriesName == "Power Usage Effectiveness"
                ? '<span style="color: green;">(Efficient)</span>'
                : item.value >= 50 &&
                  item.value < 80 &&
                  item.seriesName == "Power Usage Effectiveness" &&
                  item.seriesName == "Energy Efficiency Ratio"
                ? '<span style="color: blue;">(Moderate)</span>'
                : item.value > 80 &&
                  item.seriesName == "Energy Efficiency Ratio"
                ? '<span style="color: green;">(Efficient)</span>'
                : item.value > 80 &&
                  item.seriesName == "Power Usage Effectiveness"
                ? '<span style="color: red;">(Efficient)</span>'
                : item.value < 0 &&
                  item.seriesName == "Power Usage Effectiveness"
                ? '<span style="color: green;">(More Efficient)</span>'
                : "";
            tooltipContent += `<div>${item.seriesName}: ${item.value}% ${efficiencyLabel}</div>`;
          });
          return tooltipContent;
        },
      },
      legend: {
        data: ["Energy Efficiency Ratio", "Power Usage Effectiveness"],
        icon: "circle",

        itemGap: 20, // Adjust the gap between legend items
        itemWidth: 13, // Adjust the width of legend items
        textStyle: {
          fontSize: 10, // Adjust the font size of legend texts
          color: dashboard == "true" ? "#FFFFFF" : "black",
        },

        bottom: dashboard == "true" ? 0 : 0,
        left: 0,
      },
      grid: {
        // top: "10%",
        left: "3%",
        right: "4%",
        bottom: "12%",
        containLabel: true,
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      toolbox: false,
      xAxis: {
        type: "category",
        boundaryGap: false,
        // data: ["01:00", "02:00", "03:00", "04:00", "05:00", "07:00", "08:00"],
        // data: formattedTime,
        data: kpisData ? kpisData?.map((data) => data.time) : [],
        splitLine: {
          show: true,
          lineStyle: {
            color: "#151A20", // Set color of split lines
            type: "solid",
          },
        },
        axisLabel: {
          textStyle: {
            color: dashboard == "true" ? "#E5E5E5" : "black", // Change the color of text on the x-axis
            fontSize: "10px",
          },
        },
        // axisPointer: {
        //   snap: true,
        //   lineStyle: {
        //     color: "#7581BD",
        //     width: 2,
        //   },

        //   label: {
        //     show: true,
        //     backgroundColor: "#7581BD",
        //   },
        //   handle: {
        //     show: true,
        //     color: "#7581BD",
        //   },
        // },
      },
      yAxis: {
        type: "value",

        splitLine: {
          show: false, // Show split lines
          lineStyle: {
            color: "#151A20", // Set color of split lines
            type: "solid", // Set type of split lines (solid, dashed, or dotted)
          },
        },
        axisLabel: {
          textStyle: {
            color: dashboard == "true" ? "#E5E5E5" : "black", // Change the color of text on the x-axis
            fontSize: "10px",
          },
          formatter: function (value) {
            return value + "%"; // Display values in kilo format
          },
        },
        // min: 0,
        // max: 100,
        min: kpisData
          ? Math.min(
              ...kpisData?.map((data) =>
                Math.min(data.energy_consumption, data.power_efficiency)
              )
            )
          : 0,
        max: kpisData
          ? Math.max(
              ...kpisData?.map((data) =>
                Math.max(data.energy_consumption, data.power_efficiency)
              )
            )
          : 100,
        // max: maxYAxisValue,
      },
      series: [
        // {
        //   name: "Power Efficiency",
        //   type: "line",
        //   stack: "Total",
        //   smooth: true,
        //   lineStyle: {
        //     width: 4,
        //   },

        //   data: [42, 50, 48, 45, 60, 50, 63, 70],
        // },
        {
          name: "Energy Efficiency Ratio",
          type: "line",
          // stack: "Total",
          smooth: true,
          lineStyle: {
            width: 4,
          },
          data: kpisData
            ? kpisData?.map((data) => data?.energy_consumption)
            : [],
        },
        {
          name: "Power Usage Effectiveness",
          type: "line",
          // stack: "Total",
          smooth: true,
          lineStyle: {
            width: 4,
          },
          // data: [78, 90, 85, 90, 80, 65, 78, 75],
          data: kpisData ? kpisData?.map((data) => data?.power_efficiency) : [],
        },
        // {
        //   name: "Direct",
        //   type: "line",
        //   stack: "Total",
        //   data: [320, 332, 301, 334, 390, 330, 320],
        // },
        // {
        //   name: "Search Engine",
        //   type: "line",
        //   stack: "Total",
        //   data: [820, 932, 901, 934, 1290, 1330, 1320],
        // },
      ],
    };

    option && myChart.setOption(option);

    if (report != "true") {
      myChart.on("click", function (params) {
        // Extract the clicked data point's value
        navigate(`graph-detail/1`, {
          state: {
            value: params.value,
            time: params.name,
            siteId: siteId,
          },
        });
        // console.log("value:", params.value, "time:", params.name);
      });
    }
    // Event listener for clicking on data points

    // Clean up
    return () => {
      myChart.dispose();
    };
  }, [kpisData]);

  return (
    <div
      id="kpis"
      style={{ height: dashboard == "true" ? "255px" : "318px" }}
    ></div>
  );
};

export default KpisChart;
