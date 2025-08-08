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
        bottom: 5,
        left: 'center',
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
              fontSize: 40,
              fontWeight: 'bold',
             
            }
          },
         
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '1 Gig', itemStyle: { color: '#FF6F61' } },   // Coral Red
            { value: 735, name: '10 Gig', itemStyle: { color: '#00C2E0' } },  // Sky Blue
            { value: 580, name: '40 Gig', itemStyle: { color: '#FFC300' } },  // Sunflower Yellow
            { value: 484, name: '100 Gig', itemStyle: { color: '#9754E2' } }, // Royal Purple
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
      <Typography variant="h6" style={{ color: 'white', marginLeft: 10, marginTop: 10, fontSize: "16px", fontWeight: "500", lineHeight: "20px" }}>
        Unused Ports
      </Typography>
      <div id="unused-ports-chart" style={{ width: '100%', height: '350px' }} />
    </>
  );
};

export default UnusedPortsChart;
