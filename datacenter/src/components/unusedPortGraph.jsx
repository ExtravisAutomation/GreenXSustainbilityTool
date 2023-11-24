import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import Typography from 'antd/es/typography/Typography';

const UnusedPortsChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('unused-ports-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '90%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '1 Gig', itemStyle: { color: '#A02823' } },
            { value: 735, name: '10 Gig', itemStyle: { color: '#01A5DE' } },
            { value: 580, name: '40 Gig', itemStyle: { color: '#C89902' } },
            { value: 484, name: '100 Gig', itemStyle: { color: '#5615A2' } },
          ]
        }
      ]
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 10, marginTop: 10, fontSize: "1.25rem", fontWeight: "500", lineHeight: "20px" }}>
        Unused Ports
      </Typography>
      <div id="unused-ports-chart" style={{ width: '100%', height: '400px' }} />
    </>
  );
};

export default UnusedPortsChart;
