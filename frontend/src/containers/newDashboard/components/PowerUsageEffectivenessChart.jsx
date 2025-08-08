import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material';

const PowerUsageEffectivenessChart = ({ value = 0 }) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  const getDetailColor = (value) => {
    if (value <= 1.5) return theme?.palette?.shades?.light_green;
    if (value <= 2.5) return theme?.palette?.shades?.light_blue;
    return theme?.palette?.shades?.red;
  };

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const fillColor = getDetailColor(value);
    const option = {
      //       tooltip: {
      //         show: true,
      //         formatter: function (params) {
      //           const val = params.value;
      //           let status = '';
      //           if (val <= 1.5) {
      //             status = 'Efficient';
      //           } else if (val <= 3.5) {
      //             status = 'Moderate';
      //           } else {
      //             status = 'Inefficient';
      //           }
      //           return `Power Usage Effectiveness: <br/> (Power Input / Power Output) <br/>
      //           <strong>Note:</strong>
      //           <br/>Here Output power is used for calculation <br/> as 100% of the output power is  <br/>considered as IT load power.
      //           `;
      //         },

      //         extraCssText: `
      //   z-index: 1000;
      //   pointer-events: none;
      //   white-space: normal;
      // `,
      //         backgroundColor: theme?.palette?.graph?.toolTip_bg || '#1e1e2f',
      //         borderColor: theme?.palette?.graph?.tooltip_border || '#444',
      //         borderWidth: 1,
      //         textStyle: {
      //           color: theme?.palette?.graph?.toolTip_text_color || '#fff',
      //           fontFamily: 'Inter',
      //           fontSize: 12,
      //         },
      //       },
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: function (params) {
          const val = params.value;
          let status = '';
          if (val <= 1.5) {
            status = 'Efficient';
          } else if (val <= 2.5) {
            status = 'Moderate';
          } else {
            status = 'Inefficient';
          }

          return `
      <strong>Power Usage Effectiveness</strong><br/>
      (Power Input / Power Output)<br/>
      <strong>Note:</strong><br/>
      Output power is used for calculation,<br/>
      as 100% of the output power is<br/>
      considered as IT load power.
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
        extraCssText: 'z-index: 1000;',
      },

      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '130%',
          min: 1,
          max: 5,
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
              // color: [[1, theme?.palette?.graph?.line_color]],
              color: [[1, theme?.palette?.graph?.trailColor]],
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
              if (value === 1) return '1';
              if (value === 5) return '5';
              return '';
            },
          },
          title: { show: false },
          detail: {
            formatter: '{value}',
            color: getDetailColor(value),
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

export default PowerUsageEffectivenessChart;
