import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const HeatmapChart = () => {
  const data = [
    { time: 1, renewable: 4000, non_renewable: 3200, renew: 400, able: 400 },
    { time: 2, renewable: 1500, non_renewable: 2500, renew: 400, able: 400 },
    { time: 3, renewable: 3400, non_renewable: 400, renew: 200, able: 100 },
    { time: 4, renewable: 3200, non_renewable: 200, renew: 400, able: 500 },
    { time: 5, renewable: 3200, non_renewable: 3200, renew: 400, able: 50 },
    { time: 6, renewable: 500, non_renewable: 400, renew: 400, able: 50 },
    { time: 7, renewable: 200, non_renewable: 100, renew: 400, able: 50 },
  ];

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Renewable',
        data: generateData(data, 'renewable'),
      },
      {
        name: 'Non-Renewable',
        data: generateData(data, 'non_renewable'),
      },
      {
        name: 'Renew',
        data: generateData(data, 'renew'),
      },
      {
        name: 'Able',
        data: generateData(data, 'able'),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0, // Set radius to 0 for square boxes
          useFillColorAsStroke: true,
          size: 18, // Set the box size
          colorScale: {
            ranges: [
              {
                from: Math.min(...data.map(item => item.renewable)),
                to: Math.max(...data.map(item => item.renewable)),
                name: 'Renewable',
                color: '#1A3F4E',
              },
              {
                from: Math.min(...data.map(item => item.non_renewable)),
                to: Math.max(...data.map(item => item.non_renewable)),
                name: 'Non-Renewable',
                color: '#D21E16',
              },
              {
                from: Math.min(...data.map(item => item.renew)),
                to: Math.max(...data.map(item => item.renew)),
                name: 'Renew',
                color: '#1A3F4E',
              },
              {
                from: Math.min(...data.map(item => item.able)),
                to: Math.max(...data.map(item => item.able)),
                name: 'Able',
                color: '#1A3F4E',
              },
            ],
          },
        },
      },
    },
  });

  function generateData(data, field) {
    return data.map(item => ({
      x: `Time ${item.time}`,
      y: item[field],
    }));
  }

  return (
    <div>
      <Chart options={chartData.options} series={chartData.series} type="heatmap" height={350} width={500} />
    </div>
  );
};

export default HeatmapChart;
