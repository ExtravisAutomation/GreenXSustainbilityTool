import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

export default function DifferentLength() {
  let data = [
    { time: 1, renewable: 400, non_renewable: 100 },
    { time: 2, renewable: 500, non_renewable: 400 },
    { time: 3, renewable: 550, non_renewable: 250 },
    { time: 4, renewable: 450, non_renewable: 150 },
    { time: 5, renewable: 600, non_renewable: 300 },
    { time: 6, renewable: 500, non_renewable: 100 },
    { time: 7, renewable: 700, non_renewable: 200 },
    { time: 8, renewable: 650, non_renewable: 450 },
    { time: 9, renewable: 550, non_renewable: 200 },
    // { time: 10, renewable: 500, non_renewable: 200 },
    // { time: 11, renewable: 300, non_renewable: 100 },
  ];

  let timeArray = data.map((item) => item.time);
  let renewable = data.map((item) => item.renewable);
  let nonRenewable = data.map((item) => item.non_renewable);

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ color: 'white', padding: '5px 0px 5px 20px' }}>
        Energy Cost Comparison
      </Typography>
      <LineChart
        xAxis={[
          {
            data: timeArray,
            axisLine: { stroke: 'white' },
            tickLine: { stroke: 'white' },
            tickText: { fill: 'white' },
            valueFormatter: (value) => `${value}:00`, // Format time labels
          },
        ]}
        yAxis={[
          {
            axisLine: { stroke: 'white' },
            tickLine: { stroke: 'white' },
            tickText: { fill: 'white' },
            yAxisFormatter: (value) => `AED ${value}`, // Format currency labels
          },
        ]}
        series={[
          {
            data: renewable,
            valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
            lineStyle: {
              strokeWidth: 0,
              stroke: '#e4e4e4',
              filter: 'url(#lineShadow)',
            },
          },
          {
            data: nonRenewable,
            lineStyle: {
              strokeWidth: 0,
              stroke: '#2B8FCA',
              filter: 'url(#lineShadow)',
            },
          },
        ]}
        height={240}
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
