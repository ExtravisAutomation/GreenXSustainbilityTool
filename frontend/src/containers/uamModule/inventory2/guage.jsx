import React, { useEffect } from "react";
import * as echarts from "echarts";

const EChartsGauge = ({ data, cpu, memory }) => {
  const percentage = cpu ? data / 100 : data;
  let colorRange;

  if (!cpu && percentage < 0.5) {
    // Less than 50%
    colorRange = [
      [percentage, "#FF6347"],
      [1, "#D9D9D9"],
    ];
  } else if (!cpu && percentage <= 0.8) {
    // Between 50% and 80%
    colorRange = [
      [percentage, "#6495ED"],
      [1, "#D9D9D9"],
    ];
  } else if (!cpu && percentage > 0.8) {
    // Greater than 80%
    colorRange = [
      [percentage, "#3CB371"],
      [1, "#D9D9D9"],
    ];
  } else {
    colorRange = [
      [percentage, "#3CB371"],
      [1, "#D9D9D9"],
    ];
  }

  useEffect(() => {
    const chartDom = document.getElementById(
      memory === "true" ? "a" : "echarts-gauge"
    );
    const myChart = echarts.init(chartDom);

    const option = {
      series: [
        {
          type: "gauge",
          center: ["50%", "50%"],
          radius: "80%",
          axisLine: {
            lineStyle: {
              width: 30,
              color: colorRange,
            },
          },
          pointer: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: "black",
              width: 4,
            },
          },
          axisLabel: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            show: true,
            offsetCenter: [0, "5%"],
            formatter: function (value) {
              return cpu === "true"
                ? `{a|${value}}\n{b|%}`
                : `{a|${value}%}\n{b|usage}`;
            },
            rich: {
              a: {
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 600,
              },
              b: {
                color: "#77838F",
                fontSize: 20,
              },
            },
            color: "#FFFFFF",
            fontSize: 30,
          },
          data: [
            {
              value: cpu ? percentage * 100 : data,
            },
          ],
        },
      ],
    };

    myChart.setOption(option);

    const updateChart = () => {
      myChart.setOption({
        series: [
          {
            data: [
              {
                value: cpu ? percentage * 100 : data,
              },
            ],
          },
        ],
      });
    };

    const intervalId = setInterval(updateChart, 2000);

    return () => clearInterval(intervalId);
  }, [data, colorRange, cpu, memory, percentage]);

  return (
    <div
      id={memory === "true" ? "a" : "echarts-gauge"}
      style={{
        height: "200px",
        marginTop: "0px",
      }}
    />
  );
};

export default EChartsGauge;
