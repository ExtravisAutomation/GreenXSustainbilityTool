import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const CostInternalChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('cost-internal-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      legend: {
        orient: 'horizontal',
        right: 30,
        top: 'bottom',
        textStyle: {
          color: '#e5e5e5',
        },
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [110, 150],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 0,
          },
          label: {
            show: true,
            position: 'right',
            bottom: 5,
            color: '#e5e5e5', // Set label color to #e5e5e5
          },
          data: [
            { value: 40, name: 'Cooling Efficiency' },
            { value: 38, name: 'Renewable Energy Usage' },
            { value: 32, name: 'Carbon Footprint' },
            { value: 30, name: ' Power Utilization Effectiveness' },
            { value: 28, name: 'Water Usage Effectiveness' },
            { value: 26, name: 'Server Utilization' },
            { value: 22, name: 'Waste Recycling Rate' },
            { value: 18, name: ' Energy Conservation' },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="cost-internal-chart" style={{ width: '100%', height: '430px' }} />;
};

export default CostInternalChart;
