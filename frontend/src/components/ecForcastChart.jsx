import React, { useEffect, useContext } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const EcForecastChart = ({
  dashboard,
  legends,
  dataDevice1,
  deviceName1,
  deviceName2,

  comparedThroughputData,
}) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    console.log(deviceName1, 'deviceName1');
    console.log(deviceName2, 'deviceName2');
    console.log(comparedThroughputData, 'comparedThroughputData in');
    const chartDom = document.getElementById('forecast');
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        // backgroundColor: '#050C17',
        // borderColor: 'rgba(185, 185, 185, 0.7)',
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 14,
          fontFamily: 'inter',
          lineHeight: 1.5,
        },
        formatter: function (params) {
          const time = params[0]?.axisValueLabel;
          let tooltipContent = `<div >Time: <span style="color: ${theme?.palette?.main_layout?.secondary_text};"> ${time} </span></div>`;
          params.forEach((item) => {
            tooltipContent += `<div>${item.seriesName}: <span style="color: ${theme?.palette?.main_layout?.secondary_text};">${item.value}</span> GB</div>`;
          });
          return tooltipContent;
        },
      },
      legend: {
        data: [deviceName1 || '', deviceName2 || ''],
        itemGap: 20, // Adjust the gap between legend items
        itemWidth: 30, // Adjust the width of legend items

        textStyle: {
          fontSize: 10, // Adjust the font size of legend texts
          color:
            dashboard == 'true'
              ? theme?.palette?.main_layout?.primary_text
              : 'black',
        },

        // top: 30,
        left: 0,
        bottom: 0,
        icon: 'circle',
      },
      grid: {
        left: '0%',
        right: '3%',
        bottom: '12%',
        containLabel: true,
      },
      toolbox: false,
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: comparedThroughputData
          ? comparedThroughputData[0].map((data) => data.time)
          : null,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#151A20',
            type: 'solid',
          },
        },
        axisLabel: {
          textStyle: {
            color:
              dashboard == 'true'
                ? theme?.palette?.main_layout?.primary_text
                : 'black', // Change the color of text on the x-axis
            fontSize: '10px',
          },
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false, // Show split lines
          lineStyle: {
            color: '#151A20', // Set color of split lines
            type: 'solid', // Set type of split lines (solid, dashed, or dotted)
          },
        },

        axisLabel: {
          textStyle: {
            color:
              dashboard == 'true'
                ? theme?.palette?.main_layout?.primary_text
                : 'black',
            fontSize: '10px',
          },
          formatter: function (value) {
            return value + 'GB'; // Display values in kilo format
          },
        },
        // min: 0,
        // max: 100,
      },
      series: [
        {
          name: deviceName1,
          type: 'line',
          stack: 'Total',
          //   smooth: true,
          lineStyle: {
            width: 2,
            // color: "#2563EB",
          },
          itemStyle: {
            color: `${theme?.name.includes('Purple') ? theme?.palette?.graph?.graph_area?.secondary_line : theme?.palette?.graph?.graph_area?.line}`,
            // color: theme?.palette?.main_layout?.secondary_text,
          },
          symbol: 'circle',
          data: comparedThroughputData
            ? comparedThroughputData[0]?.map(
                (data) => data.total_bytes_rate_last_gb
              )
            : '',
        },
        // {
        //   name: "Device 2",
        //   type: "line",
        //   stack: "Total",
        //   lineStyle: {
        //     width: 2,
        //     color: "#42AE46",
        //   },
        //   symbol: "none",
        //   data: [18, 20, 30, 25, 28, 22, 20, 29],
        // },
        {
          name: deviceName2,
          type: 'line',
          // stack: "Total",
          //   smooth: true,
          lineStyle: theme?.name.includes('Purple')
            ? {
                width: 2,

                color: '#FDCF2B',
              }
            : {
                width: 2,

                color: `${theme?.palette?.graph?.graph_area?.secondary_line}`,
              },
          itemStyle: {
            // color: '#FDCF2B',
            color: theme?.name.includes('Purple')
              ? '#FDCF2B'
              : theme?.palette?.graph?.graph_area?.secondary_line,
          },
          symbol: 'circle',
          data: comparedThroughputData
            ? comparedThroughputData[1]?.map(
                (data) => data.total_bytes_rate_last_gb
              )
            : '',
        },
        // {
        //   name: "Device 4",
        //   type: "line",
        //   stack: "Total",
        //   lineStyle: {
        //     width: 2,
        //     color: "#C084FC",
        //   },
        //   symbol: "none",
        //   data: [78, 90, 85, 90, 80, 65, 78, 75],
        // },
      ],
    };

    option && myChart.setOption(option);

    // Clean up
    return () => {
      myChart.dispose();
    };
  }, [comparedThroughputData, themeMode]);

  return <div id="forecast" style={{ width: '100%', height: '260px' }}></div>;
};

export default EcForecastChart;
