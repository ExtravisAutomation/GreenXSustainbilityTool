import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';

function Co2MetricsChart({ data }) {
  const chartRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);

    const option = {
      animation: false,
      title: {
        show: false,
        text: 'CO₂ Metrics',
        subtext: 'Energy Sources',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
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
        show: true,
        bottom: '10px', // ✅ spacing from the bottom
        left: 'center',
        orient: 'horizontal',
        icon: 'circle',
        textStyle: {
          fontSize: 12,
          color: theme?.palette?.default_option?.primary_text,
        },
      },

      series: [
        {
          name: 'Energy Source',
          type: 'pie',
          radius: ['0%', '60%'], // ✅ donut-style, prevents overflow
          center: ['50%', '45%'], // ✅ move pie up to avoid legend overlap
          data: data,
          label: {
            show: true,
            color: theme?.palette?.graph?.toolTip_text_color || '#fff',
            fontSize: 12,
            fontFamily: 'Inter',
            textBorderColor: 'transparent',
            textBorderWidth: 0,
            formatter: '{b}: {c}%',
          },
          labelLine: {
            show: true,
          },
          itemStyle: {
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowColor: 'transparent',
            borderColor: theme?.mode == 'dark' ? '#000' : '#fff',
            borderWidth: 4,
          },
          emphasis: {
            scale: true,
            label: {
              show: true,
            },
            itemStyle: {
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowColor: 'transparent',
            },
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // Resize chart on window resize
    const resizeHandler = () => chartInstance.resize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartInstance.dispose();
    };
  }, [data, theme]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        // maxWidth: '600px',
        height: '100%',
        marginTop: '20px',
        // margin: 'auto',
      }}
    />
  );
}

export default Co2MetricsChart;
