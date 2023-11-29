import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BrushComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BrushComponent,
  BarChart,
  CanvasRenderer,
]);

const MonthlyCostInternalChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    let option;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate random data for two bars for each month
    let data1 = [20, 15, 22, 20, 30, 20, 22, 30, 20, 20, 15, 30]; // Energy Utilization A
    let data2 = [25, 20, 25, 25, 35, 25, 25, 35, 25, 25, 20, 35]; // Energy Utilization B

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
    };

    option = {
      title: {
        textStyle: {
          color: '#e5e5e5',
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      legend: {
        data: [
          { name: 'Energy Utilization 2022', textStyle: { color: '#e5e5e5' } },
          { name: 'Energy Utilization 2023', textStyle: { color: '#e5e5e5' } },
        ], // Legend for the two bars with color customization
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0,
      },
      toolbox: {
        show: false,
      },
      tooltip: {},
      xAxis: {
        data: monthNames, // Display month names in the xAxis
        name: 'Month',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false },
      },
      yAxis: {
        name: 'Energy Utilization',
        type: 'value',
        position: 'left',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999',
            width: 1,
            type: 'solid',
          },
        },
        axisLabel: {
          formatter: (value) => `${value} kW`, // Format the y-axis label to display kWh
        },
        splitLine: { show: false },
        // max: 100, // Uncomment this line if you want to set a maximum limit for y-axis
      },
      grid: {
        bottom: 100,
      },
      series: [
        {
          name: 'Energy Utilization 2022',
          type: 'bar',
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: '#1dec5b',
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
          data: data1,
        },
        {
          name: 'Energy Utilization 2023',
          type: 'bar',
          barWidth: 10, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: '#01A5DE',
            barBorderRadius: [50, 50, 0, 0], // Add border radius at the end of the bar
          },
          data: data2,
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  return <div id="main" style={{ width: '100%', height: '500px' }} />;
};

export default MonthlyCostInternalChart;
