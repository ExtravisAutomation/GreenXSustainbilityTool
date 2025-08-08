import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const MultiLineGraph = ({ title, xData, seriesData, legendData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Initialize the chart
    const myChart = echarts.init(chartRef.current);

    // Define the chart options
    const option = {
      //   title: {
      //     text: title || "Stacked Area Chart",
      //   },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        // data: legendData,
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: seriesData,
    };

    // Set the chart options
    myChart.setOption(option);

    // Cleanup function to dispose of the chart instance
    return () => {
      myChart.dispose();
    };
  }, [title, xData, seriesData]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default MultiLineGraph;
