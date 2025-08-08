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

    // Generate extended rawData for November
    const rawData = [];
    for (let day = 1; day <= 30; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const time = `2023-11-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00`;
        const renewable = Math.floor(Math.random() * (250 - 150 + 1)) + 150; // Random values between 150 and 250
        rawData.push({ time, renewable });
      }
    }

    const data = rawData.map(item => [moment(item.time).format('YYYY-MM-DD HH:mm:ss'), item.renewable]);

    const option = {
      legend: {
        top: 'bottom',
        data: ['Renewable'],
        textStyle: {
          color: '#e5e5e5', // Set legend text color
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
        formatter: function (params) {
          const time = moment(params[0].value[0]).format('YYYY-MM-DD HH:mm:ss');
          const renewable = params[0].value[1];
          return `${time}<br/>Renewable: ${renewable} KWH`;
        },
      },
      toolbox: {
        show: false,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: function (value) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          },
          color: '#e5e5e5', // Set x-axis label color
        },
        axisPointer: {
          snap: true,
          lineStyle: {
            color: '#7581BD',
            width: 2,
          },
          label: {
            show: true,
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
          formatter: '{value} KWH',
          color: '#e5e5e5',
        },
        z: 10,
        offset: 0,
      },
      grid: {
        top: 105,
        left: 70,
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
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 20, marginTop: 15, fontSize: "1.25rem", fontWeight: "500", lineHeight: "20px" }}>
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
