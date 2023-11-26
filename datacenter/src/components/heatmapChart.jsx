// import React, { useState, useEffect } from 'react';
// import Chart from 'react-apexcharts';

// const HeatmapChart = () => {
//   const data = [
//     { time: 1, renewable: 500, non_renewable: 3200, renew: 3200, able: 2500, datab: 400, datac: 800, datad: 3000 },
//     { time: 2, renewable: 500, non_renewable: 3200, renew: 400, able: 2500, datab: 400, datac: 800, datad: 3400 },
//     { time: 3, renewable: 500, non_renewable: 400, renew: 3200, able: 2500, datab: 400, datac: 800, datad: 2000 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 400, able: 2500, datab: 400, datac: 900, datad: 3400 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 400, able: 2500, datab: 400, datac: 900, datad: 500 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 400, able: 500, datab: 400, datac: 900, datad: 500 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 400, able: 500, datab: 400, datac: 900, datad: 500 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 400, able: 500, datab: 400, datac: 900, datad: 500 },
//     { time: 4, renewable: 500, non_renewable: 3200, renew: 4000, able: 500, datab: 400, datac: 900, datad: 500 },
//   ];

//   const [chartData, setChartData] = useState({
//     series: [
//       {
//         name: 'Renewable',
//         data: generateData(data, 'renewable'),
//       },
//       {
//         name: 'Renew',
//         data: generateData(data, 'renew'),
//       },
//       {
//         name: 'Non-Renewable',
//         data: generateData(data, 'non_renewable'),
//       },
//       {
//         name: 'Able',
//         data: generateData(data, 'able'),
//       },
//       {
//         name: 'DataB',
//         data: generateData(data, 'datab'),
//       },
//       {
//         name: 'DataC',
//         data: generateData(data, 'datac'),
//       },
//       {
//         name: 'Datad',
//         data: generateData(data, 'datad'),
//       },
//     ],
//     options: {
//       chart: {
//         height: 350,
//         type: 'heatmap',
//         events: {
//           render: (chartContext, config) => {
//             const gaps = calculateGaps(data.length);
//             applyGaps(chartContext, gaps);
//           },
//         },
//       },
//       plotOptions: {
//         heatmap: {
//           shadeIntensity: 0.5,
//           radius: 7,
//           useFillColorAsStroke: true,
//           size: 228,
//           colorScale: {
//             ranges: [
//               {
//                 from: 2500,
//                 to: 3500,
//                 name: 'Renewable',
//                 color: '#55110d',
//               },
//               {
//                 from: 2000,
//                 to: 2500,
//                 name: 'Renew',
//                 color: '#6e3bcc',
//               },
//               {
//                 from: 1500,
//                 to: 2000,
//                 name: 'Non-Renewable',
//                 color: '#D3B144',
//               },
//               {
//                 from: 1000,
//                 to: 1500,
//                 name: 'Able',
//                 color: '#1A3F4E',
//               },
//               {
//                 from: 700,
//                 to: 1000,
//                 name: 'Able',
//                 color: '#1A3F4E',
//               },
//               {
//                 from: 500,
//                 to: 700,
//                 name: 'Able',
//                 color: '#1A3F4E',
//               },
//               {
//                 from: 0,
//                 to: 500,
//                 name: 'Able',
//                 color: '#1A3F4E',
//               },
//             ],
//           },
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       yaxis: {
//         opposite: true,
//         labels: {
//           style: {
//             colors: '#e5e5e5',
//           },
//         },
//       },
//       xaxis: {
//         labels: {
//           style: {
//             colors: '#e5e5e5',
//           },
//         },
//       },
//     },
//   });

//   function generateData(data, field) {
//     return data.map(item => ({
//       x: `Time ${item.time}`,
//       y: item[field],
//     }));
//   }

//   function calculateGaps(dataLength) {
//     const gapWidth = 12; // Adjust the gap width as needed
//     const totalGaps = dataLength - 1;
//     const totalGapWidth = gapWidth * totalGaps;
//     const totalChartWidth = 100; // Set the total chart width (percentage)
//     const remainingWidth = totalChartWidth - totalGapWidth;
//     const gapPercent = (gapWidth / totalChartWidth) * 100;

//     return Array.from({ length: totalGaps }, (_, index) => ({
//       start: (remainingWidth / totalGaps) * index + gapPercent * index,
//       end: (remainingWidth / totalGaps) * (index + 1) + gapPercent * index,
//     }));
//   }

//   function applyGaps(chartContext, gaps) {
//     gaps.forEach(gap => {
//       const svg = chartContext.el.querySelector('svg');
//       const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//       rect.setAttribute('width', `${gap.start}%`);
//       rect.setAttribute('height', '100%');
//       rect.setAttribute('x', `${gap.end}%`);
//       rect.setAttribute('fill', 'white');
//       svg.appendChild(rect);
//     });
//   }

//   return (
//     <div style={{ border: '1px solid #36424E', borderRadius: '7px' }}>
//       <Chart options={chartData.options} series={chartData.series} type="heatmap" height={355} width={550} />
//     </div>
//   );
// };

// export default HeatmapChart;


import React from 'react'
import GraphBox from './graphBox'
import Typography from 'antd/es/typography/Typography'

function heatmapChart() {
  return (
    <div style={{ border: '1px solid #36424E', borderRadius: '7px', minWidth:"40%" , color:"#e5e5e5"}}>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 15, marginTop: 15, fontSize:"1.25rem", fontWeight:"500", lineHeight:"20px" }}>
Heat Map of Racks      </Typography>
     <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      


      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      


      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D21E16"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      


      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D21E16"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      


      </div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      


      </div>
  
      
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 20px 0px 20px"}}>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#D3B144"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      <GraphBox backgroundColor="#02A0FC"/>
      <GraphBox backgroundColor="#1A3F4E"/>
      


      </div>

      
    
      <div style={{padding:"15px"}}>
    
     
<div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
<Typography variant="h6" style={{ color: 'white', marginLeft: 5, marginTop: 15, fontSize:"15px", fontWeight:"500", lineHeight:"20px" }}>
Racks by Strength      </Typography>
<div style={{display:"flex", alignItems:"center", justifyContent:"space-evenly", width:"150px"}}>
   <div style={{ background:" #D21E16", height: "15px", width: "15px", borderRadius:"3px" }}>
</div>
<div style={{ background:" #1A3F4E", height: "15px", width: "15px", borderRadius:"3px" }}>
</div>
<div style={{ background:" #D3B144", height: "15px", width: "15px", borderRadius:"3px" }}>
</div>
<div style={{ background:" #02A0FC", height: "15px", width: "15px", borderRadius:"3px" }}>
</div>
      </div>
      </div>
      </div>

      

      

    
      
    </div>
  )
}

export default heatmapChart

