import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const UsedFspsChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('used-fsps-chart'); // Correct chart ID
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Used FSPs', // Correct title
        left: '5%',
        top: '2%',
        textStyle: {
          color: '#e5e5e5', // Title text color
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        bottom: '2%',
        textStyle: {
          color: '#e5e5e5', // Legend text color
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14, // Adjusted font size
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="used-fsps-chart" style={{ width: '100%', height: '400px' }} />;
};

export default UsedFspsChart;
