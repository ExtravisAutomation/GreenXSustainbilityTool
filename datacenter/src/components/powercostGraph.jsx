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
      { time: '2023-01-01T02:00:00', renewable: 200, non_renewable: 150 },
      { time: '2023-01-02T02:00:00', renewable: 300, non_renewable: 250 },
      // ... (add data for other dates)
      { time: '2023-01-03T02:00:00', renewable: 400, non_renewable: 350 },
      { time: '2023-01-04T02:00:00', renewable: 350, non_renewable: 400 },
      { time: '2023-01-05T02:00:00', renewable: 250, non_renewable: 330 },
      { time: '2023-01-06T02:00:00', renewable: 200, non_renewable: 250 },
      { time: '2023-01-07T02:00:00', renewable: 150, non_renewable: 200 },
      { time: '2023-01-08T02:00:00', renewable: 210, non_renewable: 250 },
      { time: '2023-01-09T02:00:00', renewable: 200, non_renewable: 230 },
      { time: '2023-01-10T02:00:00', renewable: 230, non_renewable: 250 },
      { time: '2023-01-11T02:00:00', renewable: 200, non_renewable: 220 },
      { time: '2023-01-12T02:00:00', renewable: 300, non_renewable: 330 },
      { time: '2023-01-13T02:00:00', renewable: 200, non_renewable: 230 },
      { time: '2023-01-14T02:00:00', renewable: 180, non_renewable: 220 },
      { time: '2023-12-15T02:00:00', renewable: 200, non_renewable: 240 },
      { time: '2023-12-16T02:00:00', renewable: 200, non_renewable: 220 },
      { time: '2023-01-17T02:00:00', renewable: 150, non_renewable: 300 },
      { time: '2023-01-18T02:00:00', renewable: 160, non_renewable: 190 },
      { time: '2023-01-19T02:00:00', renewable: 120, non_renewable: 150 },
      { time: '2023-01-20T02:00:00', renewable: 120, non_renewable: 140 },
      { time: '2023-01-21T02:00:00', renewable: 200, non_renewable: 230 },
      { time: '2023-01-22T02:00:00', renewable: 250, non_renewable: 270 },
      { time: '2023-01-23T02:00:00', renewable: 150, non_renewable: 200 },
      { time: '2023-12-24T02:00:00', renewable: 210, non_renewable: 250 },
      { time: '2023-12-25T02:00:00', renewable: 180, non_renewable: 220 },
    ];

    const data = rawData.map(item => [moment(item.time).format('YYYY-MM-DD'), item.renewable]);
    const data2 = rawData.map(item => [moment(item.time).format('YYYY-MM-DD'), item.non_renewable]);

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
            return moment(value).format('YYYY-MM-DD');
          },
          color: '#e5e5e5', // Set x-axis label color
        },
        data: data.map(item => item[0]),
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
          formatter: '{value} KWH', // Add "KWH" to the y-axis label
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
          // name: 'Renewable',
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
          // name: 'Non-renewable',
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
        Infrastructure Power Utilization
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
