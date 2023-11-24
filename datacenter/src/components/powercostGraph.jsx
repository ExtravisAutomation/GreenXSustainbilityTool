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
      { time: 0, renewable: 1200, non_renewable: 400 },
      { time: 1, renewable: 1200, non_renewable: 400 },
      { time: 2, renewable: 1200, non_renewable: 400 },
      { time: 3, renewable: 1200, non_renewable: 400 },
      { time: 4, renewable: 1150, non_renewable: 400 },
      { time: 5, renewable: 1100, non_renewable: 100 },
      { time: 6, renewable: 1112, non_renewable: 250 },
      { time: 7, renewable: 1000, non_renewable: 100 },
      { time: 8, renewable: 1200, non_renewable: 400 },
      { time: 9, renewable: 800, non_renewable: 100 }
    ];

    const data = rawData.map(item => [item.time, item.renewable]);
    const data2 = rawData.map(item => [item.time, item.non_renewable]);

    const option = {
      title: {
        text: 'Infrastructure Power Cost',
        left: 'left',
        textStyle: {
          color: '#E5E5E5',
          fontSize: 16,
        },
      },
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
        top: 110,
        left: 15,
        right: 15,
        height: 334,
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
                color: 'rgba(58,77,233,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(58,77,233,0.3)',
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
    <div
      className=""
      ref={chartRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default PowercostGraph;
