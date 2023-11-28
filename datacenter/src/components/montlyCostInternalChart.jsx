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

    let data1 = [10, 5,15, 15,-10, 30, 10, 20,10,15,20,25,30,35];
    let data2 = [-30, -10,-5,-8,-5, -15,-8,-5,-5,-10,-15,-20,-25,-30];

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
        show: false,
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
        data: monthNames,
        name: 'Month',
        axisLine: { onZero: true },
        splitLine: { show: false },
        splitArea: { show: false },
      },
      yAxis: [
        {
          name: 'Avg Usage 2022-2023',
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
            formatter: (value) => {
              if (value === 0) return 'Middle Avg Usage (Last Month)';
              else if (value < 0) return `${Math.abs(value)}% Lower`;
              else return `${value}% Higher`;
            },
          },
          splitLine: { show: false },
          max: 100, // Set maximum limit for y-axis
        },
        {
          name: 'Count',
          type: 'value',
          position: 'right',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999',
              width: 1,
              type: 'solid',
            },
          },
        },
      ],
      grid: {
        bottom: 100,
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          itemStyle: {
            color: function (params) {
              return params.data >= 0 ? 'blue' : 'green'; // Set color based on value
            },
          },
          data: data1,
        },
        {
          name: 'bar2',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          itemStyle: {
            color: function (params) {
              return params.data >= 0 ? 'blue' : 'green'; // Set color based on value
            },
          },
          data: data2,
        },
      ],
    };

    myChart.on('brushSelected', function (params) {
      var brushed = [];
      var brushComponent = params.batch[0];
      for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
        var rawIndices = brushComponent.selected[sIdx].dataIndex;
        brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
      }
      myChart.setOption({
        title: {
          backgroundColor: '#333',
          text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
          bottom: 0,
          right: '10%',
          width: 100,
          textStyle: {
            fontSize: 12,
            color: '#fff',
          },
        },
      });
    });

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  return <div id="main" style={{ width: '100%', height: '500px' }} />;
};

export default MonthlyCostInternalChart;
