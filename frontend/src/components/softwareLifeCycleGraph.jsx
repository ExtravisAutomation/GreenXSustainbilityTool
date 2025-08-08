import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const SoftwareLifeCycleGraph = ({
  chartData,
  num_devices,
  report,
  newDashboard,
  chartId = 'software-life-cycle-chart',
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    myChartRef.current = myChart;

    const option = {
      animation: false,
      tooltip: {
        trigger: 'item',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 14,
          fontFamily: 'inter',
          fontWeight: 'bold',
          lineHeight: 1.5,
        },
        formatter: function (params) {
          return `${params.name}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${params.value}</span> (${params.percent}%)<br/>Total Devices: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${num_devices}</span>`;
        },
      },
      legend: {
        orient: newDashboard ? 'vertical' : 'horizontal',
        bottom: !newDashboard ? 5 : 0,
        top: !newDashboard ? 0 : '40%',
        right: !newDashboard ? 0 : 2,
        icon: 'circle',
        textStyle: {
          color:
            report === 'true'
              ? 'gray'
              : theme?.palette?.main_layout?.primary_text,
        },
        itemStyle: {
          borderRadius: 100,
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: newDashboard ? ['30%', '70%'] : '70%',
          center: newDashboard ? ['40%', '50%'] : ['50%', '50%'],
          data: chartData,
          color: newDashboard
            ? ['#01A5DE', '#22C1A7', '#fb0200']
            : ['#fb0200', '#40C767', '#7B52DB'],
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
              color: 'gray',
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  useEffect(() => {
    // Ensure proper sizing after tab becomes visible
    setTimeout(() => {
      if (myChartRef.current) {
        myChartRef.current.resize();
      }
    }, 100);
  }, []);

  return (
    <div
      id={chartId}
      ref={chartRef}
      style={{
        width: '100%',
        height: report === 'true' ? '220px' : '335px',
      }}
    />
  );
};

export default SoftwareLifeCycleGraph;
