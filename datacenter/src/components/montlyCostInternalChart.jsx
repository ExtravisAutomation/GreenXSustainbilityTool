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

    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    for (let i = 0; i < 12; i++) {
      data1.push(+(Math.random() * -2).toFixed(2)); // Make some bars downward
      data2.push(+(Math.random() * -5).toFixed(2)); // Make some bars downward
      data3.push(+(Math.random() + 0.3).toFixed(2));
      data4.push(+Math.random().toFixed(2));
    }

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
    };

    option = {
     title: {
//   text: 'Monthly Graph',
  textStyle: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: 'bold',
    
  },
},
      legend: {
        show: false, // Remove legend
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0,
      },
      toolbox: {
        show: false, // Remove toolbox
      },
      tooltip: {},
      xAxis: {
        data: monthNames,
        name: 'Month',
        axisLine: { onZero: true },
        splitLine: { show: false }, // Remove dotted line
        splitArea: { show: false },
      },
      yAxis: [
        {
          name: 'Avg Usage Last Month',
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
          splitLine: { show: false }, // Remove dotted line
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
          data: data1,
        },
        {
          name: 'bar2',
          type: 'bar',
          stack: 'one',
          emphasis: emphasisStyle,
          data: data2,
        },
        {
          name: 'bar3',
          type: 'bar',
          stack: 'two',
          emphasis: emphasisStyle,
          data: data3,
        },
        {
          name: 'bar4',
          type: 'bar',
          stack: 'two',
          emphasis: emphasisStyle,
          data: data4,
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
