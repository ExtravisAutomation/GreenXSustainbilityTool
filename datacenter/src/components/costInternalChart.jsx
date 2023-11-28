import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const CostInternalChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('cost-internal-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Share of Monthly Cost per Site',
        textStyle: {
          color: '#e5e5e5',
          fontSize: 16,
          fontWeight: 'bold',
        },
        left: 'start',
        padding: [0 ,35],
      },
      legend: {
        orient: 'vertical',
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
            { value: 40, name: 'DXB' },
            { value: 38, name: 'SHJ' },
            { value: 32, name: 'AUH' },
            { value: 30, name: 'FUJ' },
            { value: 28, name: 'RAK' },
            { value: 26, name: 'UAQ' },
            { value: 22, name: 'AJM' },
            { value: 18, name: 'AAN' },
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

  return (
    <div id="cost-internal-chart" style={{ width: '100%', height: '400px', marginTop: '50px' }} />
  );
};

export default CostInternalChart;
