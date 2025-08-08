import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme, styled } from '@mui/material/styles';
// import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';

const EChartComponent = ({ data, categories }) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  const modelNames = data?.map((item) => item?.model_name);
  const counts = data?.map((item) => item?.count);

  useEffect(() => {
    // Initialize the chart
    const chartInstance = echarts.init(chartRef.current);

    // Define the chart options
    const options = {
      grid: {
        left: '3%',
        right: '0%',
        bottom: '10%',
        containLabel: true,
      },
      tooltip: {
        // trigger: 'axis',
        // backgroundColor: theme?.palette?.graph?.toolTip_bg,
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.title,
          fontSize: 12,
        },
        formatter: function (params) {
          let result = '';
          params.forEach((item) => {
            result += `${item.marker} ${item.seriesName}: ${item.value}<br>`;
          });
          return result;
        },
      },
      xAxis: {
        name: 'Models',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 40,
        type: 'category',
        data: modelNames,
        splitLine: {
          show: true,
          lineStyle: {
            color: theme?.palette?.graph?.yAxis,
            type: 'solid',
          },
        },
        axisLabel: { interval: 0 },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: 'Devices Count',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: -270,
        nameTextStyle: {
          letterSpacing: '2px',
          // fontSize: "10px",
          fontWeight: 500,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: theme?.palette?.graph?.yAxis,
            type: 'solid',
          },
        },
      },
      series: [
        {
          name: 'Count',
          data: counts,
          type: 'bar',
          barWidth: counts?.length < 5 ? 150 : '',
          // itemStyle: {
          //   color: theme?.name.includes('Purple')
          //     ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //         { offset: 1, color: '#6568Ed' },
          //         // { offset: 0.5, color: '#7b52db' },
          //         { offset: 0, color: '#9619B5' },
          //       ])
          //     : theme?.palette?.graph?.graph_area?.line,
          // },
          itemStyle: {
            // color: theme?.palette?.graph?.graph_area?.secondary_line,
            color: theme?.name.includes('Purple')
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // { offset: 1, color: '#5454be' },
                  // // { offset: 0.5, color: '#7b52db' },
                  // { offset: 0, color: '#791b9c' },
                  {
                    offset: 1,
                    color: 'rgba(84, 84, 190, 0.8)', // #5454be with 70% opacity
                  },
                  {
                    offset: 0,
                    color: 'rgba(121, 27, 156, 0.8)', // #791b9c with 70% opacity
                  },
                ])
              : // : theme?.palette?.graph?.graph_area?.secondary_line,
                theme?.palette?.graph?.graph_area?.line,
          },

          // old Code
          // itemStyle: {
          //   color: theme?.palette?.main_layout?.secondary_text,
          // },
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }) => `${value}`,
            color: theme?.palette?.main_layout?.primary_text, // Match text to theme
            textBorderColor: 'transparent', // Remove white border
            textBorderWidth: 0,
            textShadowColor: 'transparent', // Optional: Remove any shadow
            textShadowBlur: 0,
          },
        },
      ],
    };

    // Set the options
    chartInstance.setOption(options);

    // Resize the chart when the window is resized
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, categories]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default EChartComponent;
