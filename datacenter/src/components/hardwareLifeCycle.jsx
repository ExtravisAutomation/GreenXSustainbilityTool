import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const HardwareLifeCycle = ({ chartData }) => {
  useEffect(() => {
    const chartDom = document.getElementById('hardware-life-cycle-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Hardware Life Cycle',
        textStyle: {
          color: '#e5e5e5', // Title font color
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal', // Change to horizontal orientation
        bottom: '5%', // Position at the bottom
        textStyle: {
          color: '#e5e5e5', // Legend text color
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            textStyle: {
              color: '#e5e5e5', // Label text color
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  return <div id="hardware-life-cycle-chart" style={{ width: '100%', height: '400px' }} />;
};

export default HardwareLifeCycle;
