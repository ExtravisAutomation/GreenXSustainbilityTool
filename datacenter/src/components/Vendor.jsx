import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const Vendor = () => {
  useEffect(() => {
    // ECharts code
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Vendor Distribution',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Vendors',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 20, name: 'Vendor A' },
            { value: 15, name: 'Vendor B' },
            { value: 10, name: 'Vendor C' },
            { value: 8, name: 'Vendor D' },
            { value: 5, name: 'Vendor E' }
            // Add more vendors as needed
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // Set the option to the chart
    myChart.setOption(option);

    // Clean up the chart when the component is unmounted
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return <div id="main" style={{ width: '600px', height: '400px' }}></div>;
};

export default Vendor;
