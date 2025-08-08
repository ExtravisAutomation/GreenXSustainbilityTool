// import React, { useEffect, useRef, useMemo, useContext } from 'react';
// // import PropTypes from 'prop-types';
// import * as echarts from 'echarts';
// import debounce from 'lodash.debounce';
// import { useTheme } from '@mui/material/styles';

// const BarChart = React.memo(({
//   chartId,
//   width = '100%',
//   height = '270px',
//   series = [],
//   labelPostfix = 'kW/M',
//   ...otherOptions
// }) => {
//   const chartRef = useRef(null);
//   const theme = useTheme()

//   const xAxisData = useMemo(() => {
//     return series.length > 0 ? series[0].data.map((item) => item.name) : [];
//   }, [series]);

//   const debouncedResize = useMemo(() => debounce(() => {
//     if (chartRef.current) {
//       echarts.getInstanceByDom(chartRef.current)?.resize();
//     }
//   }, 100), []);

//   const emphasisStyle = {
//     itemStyle: {
//       shadowBlur: 10,
//       shadowColor: "rgba(0,0,0,0.3)",
//     },
//   };

//   useEffect(() => {
//     const chartDom = document.getElementById(chartId);
//     // if (!chartDom) return;
//     // const myChart = echarts.init(chartDom);

//     let myChart;
//     if (!chartRef.current) {
//       myChart = echarts.init(chartDom);
//       chartRef.current = myChart;
//     } else {
//       myChart = chartRef.current;
//     }

//     const option = {
//       title: {
//         textStyle: {
//           color: theme?.palette?.graph?.title || '#000',
//           fontSize: 14,
//           fontWeight: "bold",
//         },
//       },
//       legend: {
//         data: series.map((s) => ({
//           name: s.name,
//           textStyle: {
//             color: theme?.palette?.graph?.title || '#000',
//           },
//         })),
//       },
//       brush: {
//         toolbox: ["rect", "polygon", "lineX", "lineY", "keep", "clear"],
//         xAxisIndex: 0,
//       },
//       toolbox: {
//         show: false,
//       },
//       tooltip: {
//         backgroundColor: theme?.palette?.graph?.toolTip_bg || '#fff',
//         borderColor: theme?.palette?.graph?.tooltip_border || '#ccc',
//         textStyle: {
//           color: theme?.palette?.graph?.title || '#000',
//         },
//       },
//       xAxis: {
//         data: xAxisData,
//         name: "Month",
//         axisLine: {
//           onZero: true,
//           lineStyle: {
//             color: theme?.palette?.graph?.line_color || '#000',
//           },
//         },
//         splitLine: { show: false },
//         splitArea: { show: false },
//         axisLabel: {
//           color: theme?.palette?.graph?.title || '#000',
//           interval: 0,
//         },
//       },
//       yAxis: {
//         type: "value",
//         position: "left",
//         axisLine: {
//           show: true,
//           lineStyle: {
//             color: theme?.palette?.graph?.line_color || '#000',
//             width: 1,
//             type: "solid",
//           },
//         },
//         axisLabel: {
//           formatter: (value) => `${value} ${labelPostfix}`,
//           color: theme?.palette?.graph?.title || '#000',
//         },
//         splitLine: { show: false },
//         nameGap: 25,
//         left: "10",
//       },
//       grid: {
//         bottom: 10,
//         right: 100,
//         left: 10,
//         containLabel: true,
//       },
//       series:[],
//       // series: series.map((s) => ({
//       //   ...s,
//       //   type: 'bar',
//       //   barWidth: 10,
//       //   emphasis: emphasisStyle,
//       //   itemStyle: {
//       //     ...s.itemStyle,
//       //     barBorderRadius: [50, 50, 0, 0],
//       //   },
//       //   // label: {
//       //   //   show: true,
//       //   //   position: "insideTop",
//       //   //   formatter: (params) => {
//       //   //     if (params.dataIndex === s.data.length - 1) {
//       //   //       return `Predictive Energy for ${s.name}`;
//       //   //     } else {
//       //   //       return "";
//       //   //     }
//       //   //   },
//       //   //   textStyle: {
//       //   //     color: theme?.palette?.graph?.title || '#000',
//       //   //   },
//       //   // },
//       // })),
//       ...otherOptions,
//     };

//     myChart.setOption(option);

//     const resizeObserver = new ResizeObserver(() => {
//       debouncedResize();
//     });
//     resizeObserver.observe(chartDom);

//     return () => {
//       resizeObserver.disconnect();
//       myChart.dispose();
//     };
//   }, [chartId]);

//   useEffect(() => {

//     if (chartRef.current) {
//       chartRef.current.setOption({
//         series: series.map((s) => ({
//           ...s,
//           type: 'bar',
//           barWidth: 10,
//           emphasis: emphasisStyle,
//           itemStyle: {
//             ...s.itemStyle,
//             barBorderRadius: [50, 50, 0, 0],
//           },
//           // label: {
//           //   show: true,
//           //   position: "insideTop",
//           //   formatter: (params) => {
//           //     if (params.dataIndex === s.data.length - 1) {
//           //       return `Predictive Energy for ${s.name}`;
//           //     } else {
//           //       return "";
//           //     }
//           //   },
//           //   textStyle: {
//           //     color: theme?.palette?.graph?.title || '#000',
//           //   },
//           // },
//         })),
//       });
//     }
//   }, [series,])

//   return <div id={chartId} style={{ width, height }}></div>;
// });

// export default BarChart;

import React, { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import debounce from 'lodash.debounce';
import { useTheme } from '@mui/material/styles';

const BarChart = React.memo(
  ({
    chartId,
    width = '100%',
    height = '270px',
    series = [],
    labelPostfix = 'kW/M',
    parentModule = '',
    ...otherOptions
  }) => {
    const chartRef = useRef(null);
    const theme = useTheme();

    const xAxisData = useMemo(() => {
      return series.length > 0 ? series[0].data.map((item) => item.name) : [];
    }, [series]);

    const debouncedResize = useMemo(
      () =>
        debounce(() => {
          if (chartRef.current) {
            echarts.getInstanceByDom(chartRef.current)?.resize();
          }
        }, 100),
      []
    );

    const emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
    };

    // Initialize the chart once
    useEffect(() => {
      const chartDom = document.getElementById(chartId);
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);
      chartRef.current = myChart;

      const resizeObserver = new ResizeObserver(() => {
        debouncedResize();
      });
      resizeObserver.observe(chartDom);

      return () => {
        resizeObserver.disconnect();
        myChart.dispose();
      };
    }, [chartId]);

    // Update chart options when theme or series changes
    useEffect(() => {
      if (chartRef.current) {
        const option = {
          title: {
            textStyle: {
              color: theme?.palette?.main_layout?.primary_text || '#000',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          grid: {
            left: '4%',
            right: '6%',
            bottom: '0%',
            top: '25%',
            containLabel: true,
          },
          legend: {
            data: series.map((s) => ({
              name: s.name,
              textStyle: {
                color: theme.palette.graph?.title || '#000',
              },
            })),
          },
          xAxis: {
            data: xAxisData,
            name: 'Month',
            axisLine: {
              onZero: true,
              lineStyle: {
                color: theme.palette.graph?.line_color || '#000',
              },
            },
            // axisLabel: {
            //   color: theme.palette.graph?.title || '#000',
            //   interval: 0,
            // },
            axisLabel: {
              color: theme.palette.graph?.title || '#000',
              interval: 0,
              rotate: parentModule ? 45 : 0, // ✅ Rotate labels
              ...(otherOptions?.xAxis?.axisLabel || {}),
            },
          },
          yAxis: {
            // type: "value",
            // axisLine: {
            //   type: "dashed",
            //   lineStyle: {
            //     color: theme.palette.graph?.line_color || '#000',
            //   },
            // },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: theme.palette.graph?.line_color || '#000',
                // color: '#979797',
              },
            },
            axisLabel: {
              formatter: (value) => `${value} ${labelPostfix}`,
              color: theme.palette.graph?.title || '#000',
            },
          },
          series: series.map((s) => ({
            ...s,
            type: 'bar',
            barWidth: parentModule ? 20 : 10,
            emphasis: emphasisStyle,
            itemStyle: {
              ...s.itemStyle,
              barBorderRadius: [50, 50, 0, 0],
            },
          })),
          ...otherOptions,
        };

        chartRef.current.setOption(option);
      }
    }, [
      theme.palette.graph?.title,
      series,
      xAxisData,
      labelPostfix,
      otherOptions,
    ]);

    return <div id={chartId} style={{ width, height }}></div>;
  }
);

export default BarChart;
