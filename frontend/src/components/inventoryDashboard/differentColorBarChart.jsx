import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme, styled } from '@mui/material/styles';

const DifferentColorBarChart = ({ data, co2, color = null }) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  console.log('data.....', data);
  const model = data?.map((item) => item?.model_no);
  const powers = data?.map((item) => item?.avg_total_PIn);
  const co2Kgs = data?.map((item) => item?.avg_co2_emissions);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // Define colors for each item
    const itemColors = [
      '#5470C6', // Blue
      '#91CC75', // Green
      '#EE6666', // Red
      '#FAC858', // Yellow
      '#73C0DE', // Cyan
      '#3BA272', // Dark Green
      '#FC8452', // Orange
      '#9A60B4', // Purple
      '#EA7CCC', // Pink
    ];

    const options = {
      grid: {
        left: '3%',
        right: '2%',
        bottom: '10%',
        containLabel: true,
      },
      // tooltip: {
      //   trigger: 'axis',
      // },
      tooltip: {
        // trigger: 'axis',
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.title,
          fontSize: 12,
        },
        formatter: function (params) {
          const unit = co2 ? 'KG' : 'KW';
          const label = co2 ? 'Carbon Emission' : 'Input Power';

          // params is an array when trigger = 'axis'
          const data = params?.[0];
          return `${label}: <span style="color:${color || theme?.palette?.main_layout?.secondary_text};">${data?.value} </span> ${unit}`;
          // return `Input Power: ${data?.value} ${unit}`;
        },
      },
      xAxis: {
        name: 'Models',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 40,
        type: 'category',
        data: model,
        splitLine: {
          show: false,
          lineStyle: {
            color: theme?.palette?.graph?.yAxis,
            type: 'solid',
          },
        },
      },
      yAxis: {
        name: co2 ? 'Carbon Emission (KGs)' : 'Input Power (KW)',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 40,
        nameRotate: -270,
        type: 'value',
        // nameLocation: "middle",
        // nameGap: 40,
        // nameRotate: -270,
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
          name: co2 ? 'Carbon Emission' : 'Power',
          type: 'bar',
          data: (co2 ? co2Kgs : powers).map((value, index) => ({
            value,

            // itemStyle: {
            //   color: color
            //     ? color
            //     : theme?.palette?.main_layout?.secondary_text,
            // },
            itemStyle: {
              color: theme?.name.includes('Purple')
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    // { offset: 1, color: '#6568Ed' },

                    // { offset: 0, color: '#9619B5' },
                    {
                      offset: 1,
                      color: 'rgba(84, 84, 190, 0.9)', // #5454be with 70% opacity
                    },
                    {
                      offset: 0,
                      color: 'rgba(121, 27, 156, 0.9)', // #791b9c with 70% opacity
                    },
                  ])
                : theme?.palette?.graph?.graph_area?.line,
            },
            // label: {
            //   show: true,
            //   position: "top",
            //   formatter: ({ value }) => `${value} ${co2 ? "KG" : "W"}`,
            // },
            label: {
              show: true,
              position: 'top',
              formatter: ({ value }) => `${value} ${co2 ? 'KG' : 'KW'}`,
              color: theme?.palette?.main_layout?.primary_text, // Match text to theme
              textBorderColor: 'transparent', // Remove white border
              textBorderWidth: 0,
              textShadowColor: 'transparent', // Optional: Remove any shadow
              textShadowBlur: 0,
            },
          })),
        },
      ],
    };

    // Set the options
    chartInstance.setOption(options);

    // Resize the chart on window resize
    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default DifferentColorBarChart;
