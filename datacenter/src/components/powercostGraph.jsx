import React, { useEffect, useRef } from "react";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  DataZoomComponent,
  GridSimpleComponent,
  LegendComponent,
} from 'echarts/components';
import moment from 'moment';
import Typography from "antd/es/typography/Typography";
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { SVGRenderer } from 'echarts/renderers';

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

const PowercostGraph = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const rawData = [
      { time: '2023-11-25T02:00:00', renewable: 200 },
      { time: '2023-11-26T03:00:00', renewable: 300 },
      { time: '2023-11-27T04:00:00', renewable: 400 },
      { time: '2023-11-28T05:00:00', renewable: 400 },
      { time: '2023-11-29T06:00:00', renewable: 400 },
      { time: '2023-11-30T07:00:00', renewable: 400 },
      { time: '2023-12-01T08:00:00', renewable: 400},
      { time: '2023-12-02T09:00:00', renewable: 400 },
      { time: '2023-11-30T10:00:00', renewable: 400 },
      { time: '2023-12-01T11:00:00', renewable: 400},
      { time: '2023-12-02T12:00:00', renewable: 400 },
    ];

    const data = rawData.map(item => [item.time, item.renewable]);
    const data2 = rawData.map(item => [item.time, item.non_renewable]);

    const option = {
      legend: {
        top: 'bottom',
        data: ['Renewable', 'Non-renewable'],
        textStyle: {
          color: '#e5e5e5', // Set legend text color
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          formatter: function (value) {
            return moment(value).format('HH:mm');
          },
          color: '#e5e5e5', // Set x-axis label color
        },
        data: rawData.map(item => item.time),
        axisPointer: {
          value: '1',
          snap: true,
          lineStyle: {
            color: '#7581BD',
            width: 2,
          },
          label: {
            show: true,
            formatter: function (params) {
              return echarts.format.formatTime('yyyy-MM-dd', params.value);
            },
            backgroundColor: '#7581BD',
          },
          handle: {
            show: true,
            color: '#7581BD',
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          inside: true,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} AED', // Add "AED" to the y-axis label
          color: '#e5e5e5', // Set y-axis label color
        },
        z: 10,
        // Adjust the left margin to make space for the y-axis labels
        offset: 0,
      },
      grid: {
        top: 105,
        left: 70, // Adjust the left margin of the chart
        right: 15,
        height: 240,
        borderRadius: [7, 7, 0, 0],
        borderColor: '#36424E',
        borderWidth: 1,
      },
      dataZoom: [
        {
          type: 'inside',
          throttle: 50,
        },
      ],
      series: [
        {
          name: 'Renewable',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          sampling: 'average',
          itemStyle: {
            color: '#0770FF',
          },
          stack: 'a',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#27648a75',
              },
              {
                offset: 1,
                color: '#2c3f4b1d',
              },
            ]),
          },
          data: data,
        },
        {
          name: 'Non-renewable',
          type: 'line',
          smooth: true,
          stack: 'a',
          symbol: 'circle',
          symbolSize: 5,
          sampling: 'average',
          itemStyle: {
            color: '#36424E',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0,0,0,0)',
              },
              {
                offset: 1,
                color: 'rgba(0,0,0,0)',
              },
            ]),
          },
          data: data2,
        },
      ],
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 20, marginTop: 15, fontSize:"1.25rem", fontWeight:"500", lineHeight:"20px" }}>
        Infrastructure Power Cost
      </Typography>
      <div
        className=""
        ref={chartRef}
        style={{ width: "100%", height: "410px" }}
      />
    </>
  );
};

export default PowercostGraph;
