// import React, { useEffect } from "react";
// import * as echarts from 'echarts';
// import Typography from "antd/es/typography/Typography";

// const Co2 = () => {
//   useEffect(() => {
//     const chartDom = document.getElementById('main');
//     const myChart = echarts.init(chartDom);

//     const monthNames = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//     ];

//     const categories = (function () {
//       let res = [];
//       let len = 10;
//       while (len--) {
//         res.unshift(monthNames[len]); // Use month names instead of timestamp
//       }
//       return res;
//     })();

//     const data = (function () {
//       let res = [];
//       let len = 10;
//       while (len--) {
//         res.push(Math.round(Math.random() * 1000));
//       }
//       return res;
//     })();

//     const option = {
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'cross',
//           label: {
//             backgroundColor: '#283b56'
//           }
//         }
//       },
//       legend: {},
//       toolbox: {
//         show: true,
//         feature: {
//           dataView: { readOnly: false },
//           restore: {},
//           saveAsImage: {}
//         },
//         iconStyle: {
//           borderColor: '#e5e5e5', // Set toolbox icon border color
//         },
//         emphasis: {
//           iconStyle: {
//             color: '#e5e5e5', // Set toolbox icon color on hover
//           },
//         },
//       },
//       dataZoom: {
//         show: false,
//         start: 0,
//         end: 100
//       },
//       xAxis: {
//         type: 'category',
//         boundaryGap: true,
//         data: categories,
//         axisTick: {
//           show: false
//         },
//         axisLabel: {
//           color: '#e5e5e5', // Set x-axis label color
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
//             color: '#e5e5e5', // Set y-axis label color
//           },
//         },
//       ],
//       series: [
//         {
//           name: 'Sustainable Operations Emissions',
//           type: 'bar',
//           data: data
//         },
//       ]
//     };

//     setInterval(function () {
//       let monthIndex = new Date().getMonth();
//       let newMonthName = monthNames[monthIndex];

//       if (!categories.includes(newMonthName)) {
//         data.shift();
//         data.push(Math.round(Math.random() * 1000));
//         categories.shift();
//         categories.push(newMonthName);

//         myChart.setOption({
//           xAxis: {
//             data: categories
//           },
//           series: [
//             {
//               data: data
//             },
//           ]
//         });
//       }
//     }, 2100);

//     option && myChart.setOption(option);

//     return () => {
//       myChart.dispose();
//     };
//   }, []);

//   return (
//     <>
//       <Typography variant="h6" style={{ color: 'white', marginLeft: 10, marginTop: 15, fontSize: "1.25rem", fontWeight: "500", lineHeight: "20px" }}>
//         CO2 Emission
//       </Typography>

//       <div id="main" style={{ width: "100%", height: "380px" }} />
//     </>
//   );
// };

// export default Co2;