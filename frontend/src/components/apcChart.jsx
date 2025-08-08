// import React, { useEffect } from "react";
// import * as echarts from "echarts";

// const ApcChart = ({ data, report }) => {
//   const modifiedData = data.filter(
//     (item) => item.name !== "Unknown" && item.name !== "Battery discharge"
//   );
//   useEffect(() => {
//     const chartDom = document.getElementById("a");
//     const myChart = echarts.init(chartDom);

//     const option = {
//       tooltip: {
//         trigger: "item",
//         backgroundColor: "#050C17",
//         borderColor: "rgba(185, 185, 185, 0.7)",
//         textStyle: {
//           color: "rgba(185, 185, 185, 0.7)",
//           fontSize: 14,
//           fontFamily: "inter",
//           fontWeight: "bold",
//           lineHeight: 1.5,
//         },
//         formatter: function (params) {
//           return `${params.name}: ${params.value}%`;
//         },
//       },
//       legend: {
//         right: "0%",
//         top: "middle",
//         orient: "vertical",
//         icon: "circle",

//         textStyle: {
//           fontSize: 10,
//           color: report ? "gray" : "lightgray",
//         },
//       },
//       series: [
//         {
//           center: ["40%", "50%"],

//           type: "pie",
//           radius: ["40%", "70%"],
//           avoidLabelOverlap: false,
//           label: {
//             show: true,
//             // position: "inside",
//             formatter: "{d}",
//             color: "gray",
//             fontSize: "10px",
//             formatter: "{b}: {c} ({d}%)",
//           },
//           emphasis: {
//             label: {
//               show: false,
//               fontSize: 18,
//               fontWeight: "bold",
//               color: "#FFFFFF",
//             },
//           },

//           labelLine: {
//             show: true,
//           },
//           data: modifiedData,
//         },
//       ],
//     };

//     option && myChart.setOption(option);

//     return () => {
//       myChart.dispose();
//     };
//   }, [data]);

//   return (
//     <div id="a" style={{ height: report == "true" ? "256px" : "300px" }}></div>
//   );
// };

// export default ApcChart;

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const ApcChart = ({ data, report }) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  const modifiedData = data.filter(
    (item) => item.name !== 'Unknown' && item.name !== 'Battery discharge'
  );

  useEffect(() => {
    if (!chartRef.current) {
      // Initialize chart only once
      chartRef.current = echarts.init(document.getElementById('a'));
    }

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        border: `1px solid ${theme?.palette?.graph?.tooltip_border}`,
        textStyle: {
          color: theme?.palette?.main_layout?.primary_text,
          fontSize: 14,
          fontFamily: 'inter',
          fontWeight: 'bold',
          lineHeight: 1.5,
        },
        formatter: function (params) {
          // return `${params.name}: <span style{{color: ${theme?.palette?.main_layout?.secondary_text}}}>${params.value}</span>%`;
          return `${params.name}: <span style="color: ${theme?.palette?.main_layout?.secondary_text}">${params.value}</span>%`;
        },
      },
      legend: {
        right: '0%',
        top: 'middle',
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          fontSize: 10,
          color: report ? 'gray' : theme?.palette?.main_layout?.primary_text,
        },
      },
      series: [
        {
          center: ['40%', '50%'],
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: 'gray',
            fontSize: '10px',
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#FFFFFF',
            },
          },
          labelLine: {
            show: true,
          },
          data: modifiedData,
        },
      ],
      animation: false,
    };

    // Set chart options
    chartRef.current.setOption(option);

    // Do not dispose of the chart instance
  }, [data]); // Only re-run when data changes

  return (
    <div id="a" style={{ height: report === 'true' ? '256px' : '300px' }}></div>
  );
};

export default ApcChart;
