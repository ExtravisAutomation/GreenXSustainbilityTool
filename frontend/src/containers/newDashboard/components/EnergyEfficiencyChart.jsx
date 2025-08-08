import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';

const EnergyEfficiencyChart = ({ value = 70 }) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  const getFillColor = (value) => {
    if (value >= 75) return theme?.palette?.shades?.light_green;
    if (value >= 50) return theme?.palette?.shades?.light_blue;
    return theme?.palette?.shades?.red;
  };

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const fillColor = getFillColor(value);

    const option = {
      tooltip: {
        trigger: 'item',
        appendToBody: true,

        formatter: function (params) {
          const val = params.value;
          let status = '';
          if (val >= 75) {
            status = 'Efficient';
          } else if (val >= 50) {
            status = 'Moderate';
          } else {
            status = 'Inefficient';
          }
          return `EnergyEfficiency%: <br/> (Power Output / Power Input) * 100 `;
        },
        backgroundColor: theme?.palette?.graph?.toolTip_bg || '#1e1e2f',
        borderColor: theme?.palette?.graph?.tooltip_border || '#444',
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.toolTip_text_color || '#fff',
          fontFamily: 'Inter',
          fontSize: 12,
        },
        extraCssText: 'z-index: 1000;',
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '130%',
          min: 0,
          max: 100,
          progress: {
            show: true,
            width: 30,
            itemStyle: {
              color: fillColor,
            },
          },
          axisLine: {
            lineStyle: {
              width: 30,
              // color: [[1, '#1b1b1bff']],
              color: [[1, theme?.palette?.graph?.trailColor]], // track color
            },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          // axisLabel: { show: false },
          axisLabel: {
            show: true,
            distance: 15,
            color: theme?.palette.graph.xis || '#ccc',
            fontSize: 12,
            formatter: function (value) {
              if (value === 0) return '1';
              if (value === 100) return '100';
              return '';
            },
          },
          title: { show: false },
          detail: {
            formatter: '{value}%',
            color: fillColor,
            fontSize: 24,
            offsetCenter: [0, '5%'],
            valueAnimation: true,
          },
          data: [{ value }],
        },
      ],
    };

    chart.setOption(option);

    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', resizeHandler);
    };
  }, [value, theme]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '200px',
      }}
    />
  );
};

export default EnergyEfficiencyChart;
