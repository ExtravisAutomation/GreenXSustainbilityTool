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

    const dayNumbers = Array.from({ length: 28 }, (_, i) => i + 1); // Adjust the number of days as needed

    // Generate random data in the range of -30% to 30%
    let data1 = [-3,1,4,10,3,-10,-3,1,4,10,3,-10,-3,1,4,10,3,-10,-3,1,4,10,3,-10,-3,1,4,10,3,-10];

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
        data: dayNumbers.map(day => `${day}`), // Display day numbers in the xAxis
        name: 'Day',
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
          barWidth: 20, // Set the width of the bars
          emphasis: emphasisStyle,
          itemStyle: {
            color: function (params) {
              const value = params.data;
              if (value >= 4) {
                return '#A02823';
              } else if (value >= 2) {
                return '#C89902';
              } else if (value >= -2) {
                return '#01A5DE';
              } else {
                return '#77d810';
              }
            },
            barBorderRadius: [50, 50, 50, 50], // Add border radius at the end of the bar
          },
          data: data1,
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
