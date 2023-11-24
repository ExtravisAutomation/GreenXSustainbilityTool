import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

export default function DifferentLength() {
  return (
    <div>
      <Typography variant="h6" gutterBottom style={{color:"white", padding:"5px 0px 5px 50px" }}>
        Energy Cost Comparison
      </Typography>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
            lineStyle: {
              strokeWidth: 2, // Increase the line thickness
              stroke: 'blue', // Set the line color to blue
              filter: 'url(#lineShadow)', // Apply shadow filter
            },
          },
          {
            data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
            lineStyle: {
              strokeWidth: 2, // Increase the line thickness
              stroke: 'green', // Set the line color to green
              filter: 'url(#lineShadow)', // Apply shadow filter
            },
          },
          {
            data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
            valueFormatter: (value) => (value == null ? '?' : value.toString()),
            lineStyle: {
              strokeWidth: 2, // Increase the line thickness
              stroke: 'blue', // Set the line color to blue
              filter: 'url(#lineShadow)', // Apply shadow filter
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
