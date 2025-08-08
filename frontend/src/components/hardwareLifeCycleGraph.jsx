// import React, { useEffect } from 'react';
// import * as echarts from 'echarts';
// import { useTheme } from '@mui/material/styles';

// const HardwareLifeCycleGraph = ({
//   chartData,
//   num_devices,
//   report,
//   newDashboard,
//   chartId = 'hardware-life-cycle-chart',
// }) => {
//   const theme = useTheme();
//   useEffect(() => {
//     const chartDom = document.getElementById('hardware-life-cycle-chart');
//     const myChart = echarts.init(chartDom);

//     const option = {
//       animation: false,
//       tooltip: {
//         trigger: 'item',
//         backgroundColor: theme?.palette?.graph?.toolTip_bg,
//         border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
//         textStyle: {
//           color: theme?.palette?.main_layout?.primary_text,
//           fontSize: 14,
//           fontFamily: 'inter',
//           fontWeight: 'bold',
//           lineHeight: 1.5,
//         },
//         // formatter: '{b}: {c} ({d}%)<br/>Total Devices: ' + num_devices,
//         formatter: function (params) {
//           return `${params.name}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${params.value}</span> (${params.percent}%)<br/>Total Devices: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${num_devices}</span>`;
//         },
//       },
//       legend: {
//         orient: newDashboard ? 'vertical' : 'horizontal',
//         bottom: !newDashboard ? 5 : 0,
//         top: !newDashboard ? 0 : '40%',
//         right: !newDashboard ? 0 : 2,
//         icon: 'circle',
//         textStyle: {
//           color:
//             report == 'true'
//               ? 'gray'
//               : theme?.palette?.main_layout?.primary_text,
//         },
//         itemStyle: {
//           borderRadius: 100,
//         },
//       },
//       series: [
//         {
//           name: '',
//           type: 'pie',
//           radius: newDashboard ? ['30%', '70%'] : '70%',
//           center: newDashboard ? ['40%', '50%'] : ['50%', '50%'], // ← Move to left
//           data: chartData,

//           color: newDashboard
//             ? ['#01A5DE', '#22C1A7', '#7B52DB']
//             : ['#fb0200', '#40C767', '#7B52DB'],
//           emphasis: {
//             itemStyle: {
//               shadowBlur: 10,
//               shadowOffsetX: 0,
//               shadowColor: 'rgba(0, 0, 0, 0.5)',
//             },
//           },

//           label: {
//             show: false,
//             formatter: '{b}: {c} ({d}%)',
//             textStyle: {
//               color: 'gray',
//             },
//           },
//         },
//       ],
//     };

//     option && myChart.setOption(option);

//     return () => {
//       myChart.dispose();
//     };
//   }, [chartData]);

//   return (
//     <>
//       <div
//         id="hardware-life-cycle-chart"
//         style={{
//           width: '100%',
//           height: report == 'true' ? '220px' : '335px',
//         }}
//       />
//     </>
//   );
// };

// export default HardwareLifeCycleGraph;

// working with small issue:
// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';
// import { useTheme } from '@mui/material/styles';

// const HardwareLifeCycleGraph = ({
//   chartData,
//   num_devices,
//   report,
//   newDashboard,
//   chartId = 'hardware-life-cycle-chart',
// }) => {
//   const theme = useTheme();
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     if (chartInstance.current) {
//       chartInstance.current.dispose();
//     }

//     chartInstance.current = echarts.init(chartRef.current);

//     const option = {
//       animation: false,
//       tooltip: {
//         trigger: 'item',
//         backgroundColor: theme?.palette?.graph?.toolTip_bg,
//         border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
//         textStyle: {
//           color: theme?.palette?.main_layout?.primary_text,
//           fontSize: 14,
//           fontFamily: 'inter',
//           fontWeight: 'bold',
//           lineHeight: 1.5,
//         },
//         formatter: function (params) {
//           return `${params.name}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${params.value}</span> (${params.percent}%)<br/>Total Devices: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${num_devices}</span>`;
//         },
//       },
//       legend: {
//         orient: newDashboard ? 'vertical' : 'horizontal',
//         bottom: !newDashboard ? 5 : 0,
//         top: !newDashboard ? 0 : '40%',
//         right: !newDashboard ? 0 : 2,
//         icon: 'circle',
//         textStyle: {
//           color:
//             report === 'true'
//               ? 'gray'
//               : theme?.palette?.main_layout?.primary_text,
//         },
//         itemStyle: {
//           borderRadius: 100,
//         },
//       },
//       series: [
//         {
//           name: '',
//           type: 'pie',
//           radius: newDashboard ? ['30%', '70%'] : '70%',
//           center: newDashboard ? ['40%', '50%'] : ['50%', '50%'],
//           data: chartData,
//           color: newDashboard
//             ? ['#01A5DE', '#22C1A7', '#7B52DB']
//             : ['#fb0200', '#40C767', '#7B52DB'],
//           emphasis: {
//             itemStyle: {
//               shadowBlur: 10,
//               shadowOffsetX: 0,
//               shadowColor: 'rgba(0, 0, 0, 0.5)',
//             },
//           },
//           label: {
//             show: false,
//             formatter: '{b}: {c} ({d}%)',
//             textStyle: {
//               color: 'gray',
//             },
//           },
//         },
//       ],
//     };

//     chartInstance.current.setOption(option);

//     const handleResize = () => {
//       chartInstance.current && chartInstance.current.resize();
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       chartInstance.current && chartInstance.current.dispose();
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [chartData]);

//   return (
//     <div
//       id={chartId}
//       ref={chartRef}
//       style={{
//         width: '100%',
//         height: report === 'true' ? '220px' : '335px',
//       }}
//     />
//   );
// };

// export default HardwareLifeCycleGraph;

import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const HardwareLifeCycleGraph = ({
  chartData,
  num_devices,
  report,
  newDashboard,
  chartId = 'hardware-life-cycle-chart',
}) => {
  const theme = useTheme();

  // WOrking but not responsive:
  // useEffect(() => {
  //   let myChart;

  //   const timeoutId = setTimeout(() => {
  //     const chartDom = document.getElementById(chartId);
  //     if (!chartDom) return;

  //     myChart = echarts.init(chartDom);

  //     const option = {
  //       animation: false,
  //       tooltip: {
  //         trigger: 'item',
  //         backgroundColor: theme?.palette?.graph?.toolTip_bg,
  //         border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
  //         textStyle: {
  //           color: theme?.palette?.main_layout?.primary_text,
  //           fontSize: 14,
  //           fontFamily: 'inter',
  //           fontWeight: 'bold',
  //           lineHeight: 1.5,
  //         },
  //         formatter: function (params) {
  //           return `${params.name}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${params.value}</span> (${params.percent}%)<br/>Total Devices: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${num_devices}</span>`;
  //         },
  //       },
  //       // legend: {
  //       //   orient: newDashboard ? 'vertical' : 'horizontal',
  //       //   bottom: !newDashboard ? 5 : 0,
  //       //   top: !newDashboard ? 0 : '40%',
  //       //   right: !newDashboard ? 0 : 2,
  //       //   icon: 'circle',
  //       //   textStyle: {
  //       //     color:
  //       //       report === 'true'
  //       //         ? 'gray'
  //       //         : theme?.palette?.main_layout?.primary_text,
  //       //   },
  //       //   itemStyle: {
  //       //     borderRadius: 100,
  //       //   },
  //       // },
  //       legend: {
  //         orient: 'horizontal',
  //         icon: 'circle',
  //         top: newDashboard ? null : 'top', // Top-right when false
  //         bottom: newDashboard ? 10 : null, // Bottom-right when true
  //         right: newDashboard ? null : 10, // Right-side if false
  //         left: newDashboard ? 'center' : null,
  //         textStyle: {
  //           color:
  //             report === 'true'
  //               ? 'gray'
  //               : theme?.palette?.main_layout?.primary_text,
  //         },
  //         itemStyle: {
  //           borderRadius: 100,
  //         },
  //       },
  //       series: [
  //         {
  //           name: '',
  //           type: 'pie',
  //           radius: newDashboard ? ['30%', '60%'] : '70%',
  //           center: newDashboard ? ['50%', '45%'] : ['50%', '50%'],
  //           data: chartData,
  //           color: newDashboard
  //             ? ['#01A5DE', '#22C1A7', '#7B52DB']
  //             : ['#fb0200', '#40C767', '#7B52DB'],
  //           emphasis: {
  //             itemStyle: {
  //               shadowBlur: 10,
  //               shadowOffsetX: 0,
  //               shadowColor: 'rgba(0, 0, 0, 0.5)',
  //             },
  //           },
  //           label: {
  //             show: false,
  //             formatter: '{b}: {c} ({d}%)',
  //             textStyle: {
  //               color: 'gray',
  //             },
  //           },
  //         },
  //       ],
  //     };

  //     myChart.setOption(option);
  //   }, 0); // You can also try 100 for slightly safer delay

  //   return () => {
  //     clearTimeout(timeoutId);
  //     if (myChart) {
  //       myChart.dispose();
  //     }
  //   };
  // }, [chartData]);

  useEffect(() => {
    let myChart;

    const timeoutId = setTimeout(() => {
      const chartDom = document.getElementById(chartId);
      if (!chartDom) return;

      myChart = echarts.init(chartDom);

      const option = {
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: theme?.palette?.graph?.toolTip_bg,
          border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
          textStyle: newDashboard
            ? {
                color: theme?.palette?.graph?.toolTip_text_color || '#fff',
                fontFamily: 'Inter',
                fontSize: 12,
              }
            : {
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 14,
                fontFamily: 'inter',
                fontWeight: 'bold',
                lineHeight: 1.5,
              },
          formatter: function (params) {
            return `${params.name}: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${params.value}</span> (${params.percent}%)<br/>Total Devices: <span style="color:${theme?.palette?.main_layout?.secondary_text}">${num_devices}</span>`;
          },
        },
        legend: {
          orient: 'horizontal',
          icon: 'circle',
          top: newDashboard ? null : 'top',
          bottom: newDashboard ? 10 : null,
          right: newDashboard ? null : 10,
          left: newDashboard ? 'center' : null,
          textStyle: {
            color:
              report === 'true'
                ? 'gray'
                : theme?.palette?.main_layout?.primary_text,
          },
          itemStyle: {
            borderRadius: 100,
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: newDashboard ? ['30%', '60%'] : '70%',
            center: newDashboard ? ['50%', '45%'] : ['50%', '50%'],
            data: chartData,
            color: newDashboard
              ? ['#01A5DE', '#22C1A7', '#7B52DB']
              : ['#fb0200', '#40C767', '#7B52DB'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              show: false,
              formatter: '{b}: {c} ({d}%)',
              textStyle: {
                color: 'gray',
              },
            },
          },
        ],
      };

      myChart.setOption(option);

      // ✅ Add window resize listener
      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (myChart) {
        myChart.dispose();
      }
      // ✅ Clean up resize listener
      window.removeEventListener('resize', () => {
        if (myChart) {
          myChart.resize();
        }
      });
    };
  }, [chartData]);

  return (
    <div
      id={chartId}
      style={{
        width: '100%',
        height: report === 'true' ? '220px' : '335px',
      }}
    />
  );
};

export default HardwareLifeCycleGraph;
