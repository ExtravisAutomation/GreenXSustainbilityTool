import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const CostInternalChart = () => {
  // Your dynamic data
  const data = [
    { value: 40, name: 'DXB-40%' },
    { value: 10, name: 'SHJ-10%' },
    { value: 15, name: 'AUH-15%' },
    { value: 8, name: 'FUJ-8%' },
    { value: 6, name: 'RAK-6%' },
    { value: 7, name: 'UAQ-7%' },
    { value: 7, name: 'AJM-7%' },
    { value: 6, name: 'AAN-6%' },
  ];

  useEffect(() => {
    const chartDom = document.getElementById('cost-internal-chart');

    if (!chartDom) {
      console.error("Element with ID 'cost-internal-chart' not found.");
      return;
    }

    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '95%', // Increase the gap by setting a larger value
        left: 'center',
        textStyle: {
          color: '#e5e5e5', // Set the color of the legend text
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'transparent', // Set border color to transparent
            borderWidth: 0, // Set border width to 0
          },
          label: {
            show: true,
            position: 'outside', // Set label position to outside
            color: '#e5e5e5', // Set label color to #e5e5e5
            formatter: '{b}: {d}%', // Display percentage in the label
            emphasis: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
            length: 5, // Set the length of the label line
          },
          data: data, // Use the dynamic data here
        },
      ],
    };

    myChart.setOption(option);

    // Handle click event on the label
    // myChart.on('click', function (params) {
    //   // Check if the clicked item is a label
    //   if (params.componentType === 'series' && params.seriesType === 'pie' && params.dataIndex !== undefined) {
    //     // Navigate to the desired page
    //     window.location.href = '/dashboard';
    //   }
    // });

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, [data]); // Include 'data' in the dependency array to update the chart when data changes

  return <div id="cost-internal-chart" style={{ width: '100%', height: '400px', marginTop: '20px' }} />;
};

export default CostInternalChart;
