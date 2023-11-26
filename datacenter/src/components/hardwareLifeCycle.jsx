import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import Typography from 'antd/es/typography/Typography';

const HardwareLifeCycle = ({ chartData }) => {
  useEffect(() => {
    const chartDom = document.getElementById('hardware-life-cycle-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      // title: {
      //   text: 'Hardware Life Cycle',
      //   textStyle: {
      //     color: '#e5e5e5', // Title font color
      //   },
      // },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal', // Change to horizontal orientation
        bottom: 5, // Position at the bottom
        textStyle: {
          color: '#e5e5e5', // Legend text color
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '70%',
          data: chartData,
          color: ['#CC4C24', '#E1931E', '#4C69B5'], // Specify colors here
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: false,
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

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 10, marginTop: 10, fontSize: "16px", fontWeight: "500", lineHeight: "20px" }}>
Hardware Lifycycle      </Typography>

      <div id="hardware-life-cycle-chart" style={{ width: '100%', height: '350px' }} />
    </>
  );
};

export default HardwareLifeCycle;
