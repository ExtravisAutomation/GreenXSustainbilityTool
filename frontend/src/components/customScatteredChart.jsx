import React, { useEffect, useRef, useContext } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../context/appContext';

const CustomScatterChart = ({ data }) => {
  const chartRef = useRef(null);
  const years = data?.map((item) => item?.values);
  const theme = useTheme();
  const { themeMode, setThemeMode } = useContext(AppContext);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      // Extract years for x-axis
      const years = data?.map((dataset) => dataset.year);

      let dataArray = data?.map((dataset) => [dataset.year, dataset.co2]);
      // ECharts option configuration
      const option = {
        title: {
          text: 'AI Driven Sites CO2 Emissions ',
          left: '5%',
          top: '3%',
          textStyle: {
            fontSize: 14,
            color: theme?.palette?.main_layout?.primary_text,
          },
        },
        grid: {
          left: '4%',
          right: '6%',
          bottom: '0%',
          top: '20%',
          containLabel: true,
        },
        legend: {
          right: '10%',
          top: '3%',
          data: years,
          textStyle: {
            color: theme?.palette?.default_card?.color,
          },
        },

        xAxis: {
          type: 'category',
          // data: years,
          axisLine: {
            lineStyle: {
              color: '#888',
            },
          },
          // label
          axisLabel: {
            formatter: '{value}',
          },
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              // color: themeMode == 'dark' ? '#979797' : 'lightgray',
              color: theme.palette.graph?.line_color || '#000',
            },
          },
          scale: true,
          axisLabel: {
            formatter: '{value} Ton',
          },
          lineStyle: {
            type: 'dashed',
          },
        },

        // series: [
        //   {
        //     // symbolSize: 30,
        //     symbolSize: (dataPoint) => {
        //       let size = dataPoint[1] * 10;

        //       return Math.max(size * 2, 30);
        //     },
        //     // symbolSize: (dataPoint) => Math.sqrt(dataPoint[2]) / 5e2,
        //     data: dataArray,
        //     type: 'scatter',
        //     emphasis: {
        //       focus: 'series',
        //       label: {
        //         show: true,
        //         formatter: (param) => {
        //           return `{year|Year: ${param.data[0]}}\n{emission|Carbon Emission: ${param.data[1]} Ton}`;
        //         },
        //         rich: {
        //           year: {
        //             fontSize: 14,
        //             color: '#FF5722',
        //             fontWeight: 'bold',
        //           },
        //           emission: {
        //             fontSize: 12,
        //             color: '#4CAF50',
        //           },
        //         },
        //         position: 'top',
        //       },
        //     },
        //     itemStyle: {
        //       shadowBlur: 10,
        //       shadowColor: 'rgba(25, 100, 150, 0.5)',
        //       color: (params) => {
        //         const index = params.dataIndex; // Get the index of the data point
        //         return new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
        //           {
        //             offset: 0,
        //             color:
        //               index === 0
        //                 ? 'rgb(129, 227, 238)'
        //                 : index === 1
        //                   ? '#e3c842'
        //                   : index === 2
        //                     ? 'rgb(251, 118, 123)'
        //                     : 'rgb(129, 227, 238)',
        //           },
        //           {
        //             offset: 1,
        //             color:
        //               index === 0
        //                 ? 'rgb(25, 183, 207)'
        //                 : index === 1
        //                   ? '#e3c842'
        //                   : index === 2
        //                     ? 'rgb(204, 46, 72)'
        //                     : 'rgb(25, 183, 207)',
        //           },
        //         ]);
        //       },
        //     },
        //   },
        // ],
        series: data?.map((dataset, index) => ({
          name: dataset.year.toString(), // Set the series name to the year
          symbolSize: (dataPoint) => {
            // let size = dataPoint[1] * 10;
            // return Math.max(size * 2, 30);
            let size = dataPoint[1] * 3; // or 1.0
            return Math.max(size, 10); // Min size = 8
          },
          data: [[dataset.year, dataset.co2]], // Ensure data is in the correct format
          type: 'scatter',
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              // params give data in tooltip
              formatter: (param) => {
                return `{year|Year: ${param.data[0]}}\n{emission|Carbon Emission: ${param.data[1]} Ton}`;
              },
              rich: {
                year: {
                  fontSize: 14,
                  color: '#FF5722',
                  fontWeight: 'bold',
                },
                emission: {
                  fontSize: 12,
                  color: '#4CAF50',
                },
              },
              position: 'top',
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(25, 100, 150, 0.5)',
            color:
              dataset.Prediction === 'True'
                ? '#FF0000'
                : new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                    {
                      offset: 0,
                      color:
                        index === 0
                          ? 'rgb(129, 227, 238)'
                          : index === 1
                            ? '#e3c842'
                            : index === 2
                              ? 'rgb(251, 118, 123)'
                              : 'rgb(129, 227, 238)',
                    },
                    {
                      offset: 1,
                      color:
                        index === 0
                          ? 'rgb(25, 183, 207)'
                          : index === 1
                            ? '#e3c842'
                            : index === 2
                              ? 'rgb(204, 46, 72)'
                              : 'rgb(25, 183, 207)',
                    },
                  ]),
          },
        })),
        // series: data?.map((dataset, index) => {
        //   let mappedValues = data.map((item) => {
        //     // return [dataset.year, item[1], item[2], item[3]];
        //     return [
        //       dataset.year,
        //       item.co2,
        //       1,
        //       '',
        //     ];
        //   });
        //   return {
        //     name: dataset.year,
        //     data: mappedValues,
        //     // data: [
        //     //   dataset.year,
        //     //   dataset.co2,
        //     //   dataset.total_PIn,
        //     //   dataset.total_POut,
        //     // ],
        //     type: 'scatter',
        //     // symbolSize: (dataPoint) => Math.sqrt(dataPoint.total_PIn) / 5,
        //     symbolSize: (dataPoint) => Math.sqrt(dataPoint[2]) / 5e2,
        //     emphasis: {
        //       focus: 'series',
        //       label: {
        //         show: true,
        //         formatter: (param) => {
        //           return `{year|Year: ${param.data}}\n{emission|Carbon Emission: ${param.data.co2} Ton}`;
        //         },
        //         rich: {
        //           year: {
        //             fontSize: 14,
        //             color: '#FF5722',
        //             fontWeight: 'bold',
        //           },
        //           emission: {
        //             fontSize: 12,
        //             color: '#4CAF50',
        //           },
        //         },
        //         position: 'top',
        //       },
        //     },
        //     itemStyle: {
        //       shadowBlur: 10,
        //       shadowColor:
        //         index === 0
        //           ? 'rgba(120, 36, 50, 0.5)'
        //           : 'rgba(25, 100, 150, 0.5)',
        //       shadowOffsetY: 5,
        //       color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
        //         {
        //           offset: 0,
        //           color:
        //             index === 0
        //               ? 'rgb(129, 227, 238)'
        //               : index === 1
        //                 ? '#e3c842'
        //                 : index === 2
        //                   ? 'rgb(251, 118, 123)'
        //                   : 'rgb(129, 227, 238)',
        //         },
        //         {
        //           offset: 1,
        //           color:
        //             index === 0
        //               ? 'rgb(25, 183, 207)'
        //               : index === 1
        //                 ? '#e3c842'
        //                 : index === 2
        //                   ? 'rgb(204, 46, 72)'
        //                   : 'rgb(25, 183, 207)',
        //         },
        //       ]),
        //     },
        //   };
        // }),
      };

      // Render chart
      chartInstance.setOption(option);

      // Cleanup on component unmount
      return () => {
        chartInstance.dispose();
      };
    }
  }, [data]);
  // to modify any specific element in dom
  return <div ref={chartRef} style={{ width: '100%', height: '330px' }} />;
};

export default CustomScatterChart;
