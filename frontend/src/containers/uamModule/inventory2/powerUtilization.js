import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridSimpleComponent,
  LegendComponent,
} from "echarts/components";
import moment from "moment";
import Typography from "antd/es/typography/Typography";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { SVGRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridSimpleComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
]);

const PowerUtilizationChart = ({ dataa, isByteRate, style }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!dataa || dataa.length === 0) {
      return;
    }
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const rawData = [];

    dataa.map((item) => {
      const time = moment(item.hour).format("YYYY-MM-DD HH:mm:ss");
      const renewable =
        item.power_utilization == "null"
          ? 0
          : item.power_utilization || item?.Byetrate;
      return rawData.push({ time, renewable });
    });

    const data = rawData.map((item) => [
      moment(item.time).format("YYYY-MM-DD HH:mm"),
      item.renewable,
    ]);
    const option = {
      legend: {
        top: "bottom",
        data: ["Renewable"],
        textStyle: {
          color: "#e5e5e5", // Set legend text color
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          animation: false,
        },
        formatter: function (params) {
          const time = moment(params[0].value[0]).format("HH:mm");
          const renewable = params[0].value[1];
          return isByteRate
            ? `ByteRate: ${renewable} GB <br/> Time: ${time}`
            : `Power Utilization: ${renewable} W <br/> Time: ${time}`;
        },
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
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: function (value) {
            return moment(value).format("HH:mm");
          },
          color: "#e5e5e5", // Set x-axis label color
        },
        axisPointer: {
          snap: true,
          lineStyle: {
            color: "#7581BD",
            width: 2,
          },
          label: {
            show: true,
            backgroundColor: "#7581BD",
          },
          handle: {
            show: true,
            color: "#7581BD",
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        axisTick: {
          inside: true,
        },
        splitLine: {
          show: false,
        },

        axisLabel: {
          // inside: true,
          formatter: isByteRate ? "{value} GB" : "{value} W",
          color: "#e5e5e5",
        },
        z: 10,
        offset: 0,
      },
      grid: {
        bottom: style?.bottom,
        left: 60,
        right: 10,
        // height: 200,
        borderRadius: [7, 7, 0, 0],
        borderColor: "#36424E",
        borderWidth: 1,
      },
      dataZoom: [
        {
          type: "inside",
          // throttle: 50,
        },
      ],
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          sampling: "average",
          itemStyle: {
            // color: "#0770FF",
            color: "#0490E7",
          },
          lineStyle: {
            width: 1, // Adjust this value to set the thickness of the line
          },
          stack: "a",
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
          data: data,
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [dataa]);

  if (!dataa || dataa.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: "white",
            marginLeft: 20,
            marginTop: 15,
            fontSize: "1.25rem",
            fontWeight: "500",
            lineHeight: "20px",
          }}
        >
          No data available
        </Typography>
      </div>
    );
  }
  return (
    <>
      <div
        className=""
        ref={chartRef}
        style={{ height: style?.height, ...style }}
      />
    </>
  );
};

export default PowerUtilizationChart;
