import React, { useEffect, useContext } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const DeviceSpecificConsuptionChart = ({
  deviceSpecificChartData,
  comparedDevicesData,
  dashboard,
  deviceName1,
  deviceName2,
}) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  console.log('mycode: Compared Devices Data::::', comparedDevicesData);

  useEffect(() => {
    const chartDom = document.getElementById('specific');
    const myChart = echarts.init(chartDom);
    // const option = {
    //   grid: {
    //     top: '18%',
    //     left: '3%',
    //     right: '4%',
    //     bottom: '14%',
    //     containLabel: true,
    //   },

    //   tooltip: {
    //     trigger: 'axis',
    //     backgroundColor: theme?.palette?.graph?.toolTip_bg,
    //     borderColor: theme?.palette?.graph?.tooltip_border,
    //     textStyle: {
    //       color: theme?.palette?.main_layout?.primary_text,
    //       fontSize: 14,
    //       fontFamily: 'inter',
    //       // fontWeight: "bold",
    //       lineHeight: 1.5,
    //     },
    //     formatter: function (params) {
    //       const time = params ? params[0]?.axisValueLabel : [];
    //       let tooltipContent = `<div>Time: ${time}</div>`;
    //       params?.forEach((item) => {
    //         tooltipContent += `<div>${item?.seriesName}:    ${item?.value} KW</div>`;
    //       });
    //       return tooltipContent;
    //     },
    //   },

    //   toolbox: false,
    //   // toolbox: {
    //   //   feature: {
    //   //     dataView: { show: true, readOnly: false },
    //   //     magicType: { show: true, type: ["line", "bar"] },
    //   //     restore: { show: true },
    //   //     saveAsImage: { show: true },
    //   //   },
    //   // },
    //   legend: {
    //     // data: [
    //     //   deviceName1 ? deviceName1 : 'RYD-SLY-00-F14',
    //     //   deviceName2 ? deviceName2 : 'RYD-SLY-00-AF14',
    //     // ],
    //     icon: 'circle',
    //     itemGap: 20, // Adjust the gap between legend items
    //     itemWidth: 20, // Adjust the width of legend items
    //     textStyle: {
    //       fontSize: 10, // Adjust the font size of legend texts
    //       color:
    //         dashboard == 'true'
    //           ? theme?.palette?.main_layout?.primary_text
    //           : 'black',
    //     },
    //     bottom: 0,
    //     left: 0,
    //   },
    //   // xAxis: [
    //   //   {
    //   //     type: "category",
    //   //     data: deviceSpecificChartData
    //   //       ? deviceSpecificChartData?.device_name1.map((data) =>
    //   //           formatDate(data?.time)
    //   //         )
    //   //       : comparedDevicesData
    //   //       ? comparedDevicesData[0]?.map((data) => formatDate(data.time))
    //   //       : [],

    //   //     axisPointer: {
    //   //       type: "shadow",
    //   //     },
    //   //   },
    //   // ],
    //   xAxis: [
    //     {
    //       type: 'category',
    //       data: deviceSpecificChartData
    //         ? deviceSpecificChartData?.device_name1
    //             ?.slice(0, 6)
    //             ?.map((data) => formatDate(data.time))
    //         : comparedDevicesData?.length > 0
    //           ? comparedDevicesData[0]
    //               ?.slice(0, 6)
    //               ?.map((data) => formatDate(data.time))
    //           : [],
    //       axisPointer: {
    //         type: 'shadow',
    //       },
    //     },
    //   ],
    //   yAxis: [
    //     {
    //       type: 'value',
    //       //   name: "Device 2",
    //       min: 0,
    //       //   max: 250,
    //       //   interval: 50,
    //       splitLine: {
    //         show: true,
    //         lineStyle: {
    //           type: 'dashed',
    //           color: '#979797',
    //         },
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: '#979797',
    //           fontSize: '15px',
    //         },
    //         formatter: function (value) {
    //           return value + 'KW';
    //         },
    //       },
    //     },
    //   ],
    //   series: [
    //     {
    //       name:
    //         // deviceName1 ||
    //         comparedDevicesData?.length > 0
    //           ? comparedDevicesData[0][0]?.device_name
    //           : deviceSpecificChartData
    //             ? deviceSpecificChartData?.device_name1[0]?.device_name
    //             : [],
    //       type: 'bar',
    //       barWidth: 20,
    //       itemStyle: {
    //         color: `${theme?.name?.includes('Purple') ? ' #FDCF2B' : theme?.palette?.graph?.graph_area?.line}`,
    //       },
    //       // tooltip: {
    //       //   valueFormatter: function (value) {
    //       //     return value + "k";
    //       //   },
    //       // },

    //       data: deviceSpecificChartData
    //         ? deviceSpecificChartData?.device_name1?.map(
    //             (data) => data?.total_power
    //           )
    //         : comparedDevicesData?.length > 0
    //           ? comparedDevicesData[0]?.map((data) => data?.total_power)
    //           : [],
    //     },
    //     {
    //       name:
    //         // deviceName2 ||
    //         comparedDevicesData?.length > 0
    //           ? comparedDevicesData[1][0]?.device_name
    //           : deviceSpecificChartData
    //             ? deviceSpecificChartData?.device_name2[0]?.device_name
    //             : [],
    //       type: 'bar',
    //       barWidth: 20,
    //       itemStyle: {
    //         // color: theme?.palette?.graph?.graph_area?.secondary_line,
    //         color: theme?.name.includes('Purple')
    //           ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //               { offset: 1, color: '#5454be' },

    //               { offset: 0, color: '#791b9c' },
    //             ])
    //           : theme?.palette?.graph?.graph_area?.secondary_line,
    //       },
    //       // tooltip: {
    //       //   valueFormatter: function (value) {
    //       //     return value + "k";
    //       //   },
    //       // },
    //       data: deviceSpecificChartData
    //         ? deviceSpecificChartData?.device_name2?.map(
    //             (data) => data?.total_power
    //           )
    //         : comparedDevicesData
    //           ? comparedDevicesData[1]?.map((data) => data?.total_power)
    //           : [],
    //     },
    //     // {
    //     //   name: "Temperature",
    //     //   type: "line",
    //     //   yAxisIndex: 1,
    //     //   tooltip: {
    //     //     valueFormatter: function (value) {
    //     //       return value + " °C";
    //     //     },
    //     //   },
    //     //   data: [
    //     //     2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
    //     //   ],
    //     // },
    //   ],
    // };
    const option = {
      grid: {
        top: '18%',
        left: '3%',
        right: '4%',
        bottom: '14%',
        containLabel: true,
      },

      tooltip: {
        trigger: 'axis',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 14,
          fontFamily: 'inter',
          lineHeight: 1.5,
        },
        formatter: function (params) {
          const time = params ? params[0]?.axisValueLabel : [];
          let tooltipContent = `<div>Time:  <span style= "color: ${theme?.palette?.main_layout?.secondary_text};">${time} </span>  </div>`;
          params?.forEach((item) => {
            tooltipContent += `<div>${item?.seriesName}: <span style="color: ${theme?.palette?.main_layout?.secondary_text};> ${item?.value} </span> KW</div>`;
          });
          return tooltipContent;
        },
      },

      toolbox: false,

      legend: {
        data: [
          {
            name:
              comparedDevicesData?.length > 0
                ? comparedDevicesData[0][0]?.device_name
                : deviceSpecificChartData?.device_name1[0]?.device_name,
            icon: 'circle',
            itemStyle: {
              color: theme?.name?.includes('Purple')
                ? '#FDCF2B'
                : theme?.palette?.graph?.graph_area?.line,
            },
          },
          {
            name:
              comparedDevicesData?.length > 0
                ? comparedDevicesData[1][0]?.device_name
                : deviceSpecificChartData?.device_name2[0]?.device_name,
            icon: 'circle',
            itemStyle: {
              color: theme?.name?.includes('Purple')
                ? theme?.palette?.main_layout?.secondary_text
                : theme?.palette?.graph?.graph_area?.secondary_line,
              // color: theme?.palette?.main_layout?.secondary_text, // Solid color representing gradient
            },
          },
        ],
        itemGap: 20,
        itemWidth: 20,
        textStyle: {
          fontSize: 10,
          color:
            dashboard == 'true'
              ? theme?.palette?.main_layout?.primary_text
              : 'black',
        },
        bottom: 0,
        left: 0,
      },

      xAxis: [
        {
          type: 'category',
          data: deviceSpecificChartData
            ? deviceSpecificChartData?.device_name1
                ?.slice(0, 6)
                ?.map((data) => formatDate(data.time))
            : comparedDevicesData?.length > 0
              ? comparedDevicesData[0]
                  ?.slice(0, 6)
                  ?.map((data) => formatDate(data.time))
              : [],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],

      yAxis: [
        {
          type: 'value',
          min: 0,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#979797',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#979797',
              fontSize: '12px',
            },
            formatter: function (value) {
              return value + 'KW';
            },
          },
        },
      ],

      series: [
        {
          name:
            comparedDevicesData?.length > 0
              ? comparedDevicesData[0][0]?.device_name
              : deviceSpecificChartData?.device_name1[0]?.device_name || '',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            color: theme?.name?.includes('Purple')
              ? '#FDCF2B'
              : theme?.palette?.graph?.graph_area?.line,
          },
          data: deviceSpecificChartData
            ? deviceSpecificChartData?.device_name1?.map(
                (data) => data?.total_power
              )
            : comparedDevicesData?.length > 0
              ? comparedDevicesData[0]?.map((data) => data?.total_power)
              : [],
        },
        {
          name:
            comparedDevicesData?.length > 0
              ? comparedDevicesData[1][0]?.device_name
              : deviceSpecificChartData?.device_name2[0]?.device_name || '',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            color: theme?.name.includes('Purple')
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: '#5454be' },
                  { offset: 0, color: '#791b9c' },
                ])
              : theme?.palette?.graph?.graph_area?.secondary_line,
          },
          data: deviceSpecificChartData
            ? deviceSpecificChartData?.device_name2?.map(
                (data) => data?.total_power
              )
            : comparedDevicesData?.length > 0
              ? comparedDevicesData[1]?.map((data) => data?.total_power)
              : [],
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [deviceSpecificChartData, comparedDevicesData, themeMode]);

  return <div id="specific" style={{ height: '270px' }}></div>;
};

export default DeviceSpecificConsuptionChart;
