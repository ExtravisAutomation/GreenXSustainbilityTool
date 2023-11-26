import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import Typography from 'antd/es/typography/Typography';

const UsedFspsChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('used-ports-chart'); // Corrected ID
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 5, // Position at the bottom
        textStyle: {
          color: '#e5e5e5', // Legend text color
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 500, name: '1 Gig', itemStyle: { color: '#1A3F4E' } },
            { value: 2000, name: '10 Gig', itemStyle: { color: '#0490E7' } },
            { value: 1580, name: '40 Gig', itemStyle: { color: '#C89902' } },
            { value: 484, name: '100 Gig', itemStyle: { color: '#4C791B' } },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 10, marginTop: 10, fontSize: '16px', fontWeight: '500', lineHeight: '20px' }}>
        Unused SFPs
      </Typography>
      <div id="used-ports-chart" style={{ width: '100%', height: '350px' }} />
    </>
  );
};

export default UsedFspsChart;
