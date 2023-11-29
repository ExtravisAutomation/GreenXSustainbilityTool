// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';
// import Typography from 'antd/es/typography/Typography';

// const Co = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chartDom = document.getElementById('main');
//     const myChart = echarts.init(chartDom);
//     chartRef.current = myChart;

//     const monthNames = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//     ];

//     const generateData = () => {
//       return monthNames.map((month, index) => {
//         return Data[index]; // Assuming Data is an array with CO2 emission values
//       });
//     };

//     const data = ;

//     const option = {
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'cross',
//           label: {
//             backgroundColor: '#283b56',
//           },
//         },
//       },
//       toolbox: {
//         show: true,
//         feature: {
//           dataView: { readOnly: false },
//           restore: {},
//           saveAsImage: {},
//         },
//         iconStyle: {
//           borderColor: '#e5e5e5',
//         },
//         emphasis: {
//           iconStyle: {
//             color: '#e5e5e5',
//           },
//         },
//       },
//       xAxis: {
//         type: 'category',
//         boundaryGap: true,
//         data: monthNames,
//         axisTick: {
//           show: false,
//         },
//         axisLabel: {
//           color: '#e5e5e5',
//         },
//       },
//       yAxis: [
//         {
//           type: 'value',
//           scale: true,
//           name: 'CO2 Emission (kg)',
//           max: 1200,
//           min: 0,
//           boundaryGap: [0.2, 0.2],
//           axisLabel: {
//             formatter: '{value} kg',
//             color: '#e5e5e5',
//           },
//         },
//       ],
//       series: [
//         {
//           name: 'Sustainable Operations Emissions',
//           type: 'bar',
//           data: data,
//           itemStyle: {
//             color: '#8ec06c', // Adjust the bar color as needed
//           },
//         },
//       ],
//     };

//     const updateData = () => {
//       setInterval(() => {
//         const newData = generateData();

//         myChart.setOption({
//           series: [
//             {
//               data: newData,
//             },
//           ],
//         });
//       }, 2100);
//     };

//     option && myChart.setOption(option);
//     updateData();

//     return () => {
//       myChart.dispose();
//     };
//   }, []);

//   return (
//     <>
//       <Typography
//         variant="h6"
//         style={{
//           color: 'white',
//           marginLeft: 10,
//           marginTop: 15,
//           fontSize: '1.25rem',
//           fontWeight: '500',
//           lineHeight: '20px',
//         }}
//       >
//         CO2 Emission
//       </Typography>

//       <div id="main" style={{ width: '100%', height: '380px' }} />
//     </>
//   );
// };

// export default Co;

import React from 'react'

function co() {
  return (
    <div>
      
    </div>
  )
}

export default co

