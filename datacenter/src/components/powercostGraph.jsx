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
      { time: '2023-11-25T00:00:00', renewable: 1200 },
      { time: '2023-11-26T00:00:00', renewable: 1200 },
      { time: '2023-11-27T00:00:00', renewable: 1200 },
      { time: '2023-11-28T00:00:00', renewable: 1200 },
      { time: '2023-11-29T00:00:00', renewable: 1150 },
      { time: '2023-11-30T00:00:00', renewable: 1100 },
      { time: '2023-11-31T00:00:00', renewable: 1112 },
      { time: '2023-12-01T00:00:00', renewable: 1000},
      { time: '2023-12-02T00:00:00', renewable: 1200 },
      { time: '2023-1-03T00:00:00', renewable: 800}
    ];

    const data = rawData.map(item => [item.time, item.renewable]);
    const data2 = rawData.map(item => [item.time, item.non_renewable]);

    const option = {
      // // title: {
      // //   text: 'Infrastructure Power Cost',
      // //   left: 'left',
      // //   textStyle: {
      // //     color: '#E5E5E5',
      // //     fontSize: 16,
      // //     padding: [10, 0, 0, 10],
      // //   },
      // },
      legend: {
        top: 'bottom',
        data: ['Renewable', 'Non-renewable'],
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
          },},
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
          inside: true,
          formatter: '{value}\n',
        },
        z: 10,
      },
      grid: {
        top: 120,
        left: 15,
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
    
    <Typography variant="h6" style={{ color: 'white', marginLeft: 45, marginTop: 10, fontSize:"1.25rem", fontWeight:"500", lineHeight:"20px" }}>
        Infrastructure Power Cost
      </Typography>
    <div
      className=""
      ref={chartRef}
      style={{ width: "100%", height: "100%" }}
    />
    </>
  );
};

export default PowercostGraph;
