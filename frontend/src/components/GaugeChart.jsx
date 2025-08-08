// GaugeChart.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';
const GaugeChart = ({
  value = 0,
  color = '#9619b5',
  trackColor = '#c8d3fd',
  size = 150,
  min = 1,
  max = 5,
  rackpage = false,
}) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  useEffect(() => {
    if (!chartRef.current) return;
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 220,
          endAngle: 320,
          center: ['50%', '50%'],
          //   radius: '80%',
          min: min,
          max: max,
          splitNumber: 10,
          animation: true,
          itemStyle: {
            // color,
            color: rackpage
              ? color
              : theme?.name?.includes('Purple')
                ? {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#791b9c', // Start color (e.g., purple)
                      },

                      {
                        offset: 1,
                        color: '#5454be', // End color (e.g., cyan)
                      },
                    ],
                  }
                : theme?.palette?.main_layout?.secondary_text,
            shadowColor: 'rgba(128,0,255,0.3)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          progress: {
            show: true,
            roundCap: false,
            width: 30,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            roundCap: false,
            lineStyle: {
              width: 30,
              color: [[1, trackColor]],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,

            formatter: function (val) {
              return val.toFixed(2);
            },
            fontSize: 24,
            fontWeight: 'bold',
            color: rackpage
              ? color
              : theme?.palette?.main_layout?.secondary_text,
            offsetCenter: [0, '10%'],
          },
          data: [{ value }],
        },
      ],
    };

    chartInstance.setOption(option);

    // Resize on container change
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      chartInstance.dispose();
      resizeObserver.disconnect();
    };
  }, [value, color, trackColor]);

  return (
    <div
      ref={chartRef}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default GaugeChart;
