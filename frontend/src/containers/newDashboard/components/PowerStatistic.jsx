import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';
import styled from 'styled-components';

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const PowerStatistic = ({ data, isPowerStatistic = false }) => {
  const theme = useTheme();
  const chartRef = useRef(null);

  const input = data?.inputTraffic ?? 0;
  const output = data?.outputTraffic ?? 0;
  const filledPercent = isPowerStatistic
    ? (data?.powerUsagePer ?? 0)
    : (data?.dataUtilization ?? 0);
  const remainingPercent = 100 - filledPercent;

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const chartData = [
      {
        name: isPowerStatistic ? 'Power Usage' : 'Data Utilization',
        value: filledPercent,
        itemStyle: {
          color: isPowerStatistic
            ? theme?.palette?.shades?.purple
            : theme?.palette?.shades?.dark_purple,
        },
        tooltip: { show: true },
      },
      {
        name: 'Remaining',
        value: remainingPercent,
        itemStyle: {
          // color: '#0D131C',
          color: theme?.palette?.graph?.trailColor,
        },
        tooltip: { show: false },
      },
    ];

    const option = {
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: () => {
          return isPowerStatistic
            ? `
              Power Usage: ${filledPercent}%<br/>
              Power Input: ${data?.inputPower} kW <br/>
              Power Output: ${data?.outputPower} kW
            `
            : `
              Data Utilization: ${filledPercent}% <br/>
              Allocated Data Traffic: ${input.toFixed(2)} <br/>
              Consumed Data Traffic: ${output.toFixed(2)}
            `;
        },
        backgroundColor: theme?.palette?.graph?.toolTip_bg || '#1e1e2f',
        borderColor: theme?.palette?.graph?.tooltip_border || '#444',
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.toolTip_text_color || '#fff',
          fontFamily: 'Inter',
          fontSize: 12,
        },
        extraCssText: 'z-index: 1000;', // Fix tooltip layering
      },

      legend: {
        show: false,
        bottom: 0,
        icon: 'circle',
        data: [
          {
            name: isPowerStatistic ? 'Power Usage' : 'Data Utilization',
            itemStyle: {
              color: !isPowerStatistic
                ? theme?.palette?.shades?.dark_purple
                : theme?.palette?.shades?.purple,
            },
          },
        ],
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 12,
        },
      },

      series: [
        {
          animation: false,
          name: isPowerStatistic ? 'Power Usage' : 'Traffic Utilization',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          startAngle: 270,
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: theme?.palette?.mode === 'dark' ? '#0E1117' : '#fff',
            borderWidth: 0,
          },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: false,
            label: { show: false },
          },
          data: chartData,
        },
      ],

      graphic: {
        type: 'text',
        left: 'center',
        top: '45%',
        style: {
          text: `${filledPercent}%`,
          textAlign: 'center',
          fill: theme?.palette?.main_layout?.primary_text,
          fontSize: 24,
          fontWeight: 700,
        },
      },
    };

    chart.setOption(option);

    const resizeHandler = () => chart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.dispose();
    };
  }, [theme, data, input, output, filledPercent, isPowerStatistic]);

  return <ChartWrapper ref={chartRef} />;
};

export default PowerStatistic;
