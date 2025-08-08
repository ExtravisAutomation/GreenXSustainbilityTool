// import React, { useEffect } from "react";
// import * as echarts from 'echarts';
// import Typography from "antd/es/typography/Typography";

// const EmissionChart = () => {
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

// export default EmissionChart;

import React from "react";
import GraphBox from "./graphBox";
import Typography from "antd/es/typography/Typography";
import { useNavigate } from "react-router-dom";

function emissionChart() {
 


  return (
    <div
      style={{
        border: "1px solid #36424E",
        borderRadius: "7px",
        minWidth: "50%",
        color: "#e5e5e5",
        height:"430px"
      }}
    >
      <Typography
        variant="h6"
        style={{
          color: "white",
          marginLeft: 15,
          marginTop: 15,
          fontSize: "1.25rem",
          fontWeight: "500",
          lineHeight: "20px",
        }}
      >
        Detail of Heat Map of Racks{" "}
      </Typography>

      <div
        style={{
          border: "1px solid #36424E",
          margin: "5px 20px",
          height: "370px",
          borderRadius: "7px",
          color: "#e5e5e5",
        //   border:"3px solid red",
          flexBasis:"30%",
          // height:"450px"
        }}
      >
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
        <div
        style={{
          display: "flex",
          justifyContent: "start",
          flexDirection:"column",
          alignItems: "start",
          color: "#e5e5e5",
          padding:"20px 20px",
          
         
        }}
      >
        <p style={{padding:"0px", margin:"0px", fontWeight:"bold"}}>Est. Daily Cost this Month </p>
        <p style={{padding:"10px 0px", margin:"0px", fontWeight:"bold", fontSize:"40px", color:"#ac1717"}}>AED 783.45 </p>
        <p>Estimated daily Cost so far this month, based on your sites energy and the average energy cost in each sites region</p>
      </div>
        </div>
       
      </div>
     
     
     
   

  

    
    </div>
  );
}

export default emissionChart;






