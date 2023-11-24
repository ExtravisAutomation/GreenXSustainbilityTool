import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

export default function DifferentLength() {
  let data = [
    { time: 1, renewable: 200, non_renewable: 400 },
    { time: 2, renewable: 400, non_renewable: 150 },
    { time: 3, renewable: 250, non_renewable: 100 },
    { time: 4, renewable: 150, non_renewable: 250 },
    { time: 5, renewable: 300, non_renewable: 100 },
    { time: 6, renewable: 500, non_renewable: 400 },
    { time: 7, renewable: 200, non_renewable: 100 }
  ];

  let timeArray = data.map((item) => item.time);

  let renewable = data.map((item) => item.renewable);
  let nonRenewable = data.map((item) => item.non_renewable);

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ color: "white", padding: "5px 0px 5px 50px" }}>
        Energy Cost Comparison
      </Typography>
      <LineChart
        xAxis={[
          {
            data: timeArray,
            axisLine: { stroke: 'white' }, // X-axis line color
            tickLine: { stroke: 'white' }, // X-axis tick line color
            tickText: { fill: 'white' }, // X-axis tick text color
          },
        ]}
        yAxis={[
          {
            axisLine: { stroke: '#fff' }, // Y-axis line color
            tickLine: { stroke: '#fff' }, // Y-axis tick line color
            tickText: { fill: 'white' }, // Y-axis tick text color
          },
        ]}
        series={[
          {
            data: renewable,
            valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
            lineStyle: {
              strokeWidth: 2,
              stroke: 'lightblue', // Adjust color for dark mode
              filter: 'url(#lineShadow)',
            },
          },
          {
            data: nonRenewable,
            lineStyle: {
              strokeWidth: 2,
              stroke: 'lightgreen', // Adjust color for dark mode
              filter: 'url(#lineShadow)',
            },
          },
        ]}
        height={200}
        margin={{ top: 10, bottom: 20 }}
      >
        <defs>
          <filter id="lineShadow" x="0" y="0" width="200%" height="200%">
            <feOffset result="offOut" in="SourceAlpha" dx="4" dy="4" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
      </LineChart>
    </div>
  );
}
