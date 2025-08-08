import React from 'react';
import BarChart from '../../../../components/graphs/BarChart';
import { useTheme } from '@mui/material/styles';

const PredictionBarChart = ({
  predictionText = 'Predictive Energy',
  chartName = 'Historical Data',
  data,
  chartId = 'demo-bar-chart-1',
}) => {
  const theme = useTheme();
  console.log('theme color:::::::', theme?.palette?.graph?.graph_area?.line);

  const dummyData = [
    {
      name: chartName,
      itemStyle: {
        color: `${theme?.palette?.graph?.graph_area?.line}`, // Color for prediction
      },
      data:
        (Array.isArray(data) &&
          data?.map((item) => ({
            ...item,
            // value: Math.random() * item.value,
            itemStyle: {
              // color: item.prediction ? '#FF0000' : '#4C791B', // Change color based on prediction
              color: item.prediction
                ? '#FF0000'
                : `${theme?.palette?.graph?.graph_area?.line}`, // Change color based on prediction
            },
            label: {
              show: true,
              position: 'top',
              formatter: (params) => {
                if (item.prediction) {
                  return `${predictionText} for ${item?.name}`;
                } else {
                  return '';
                }
              },
              textStyle: {
                color: theme?.palette?.graph?.title || '#000',
                // color:'#000'
              },
            },
          }))) ||
        [],
    },
    {
      name: 'Prediction',
      itemStyle: {
        color: '#FF0000', // Color for prediction
      },
    },
  ];

  // const dummyData = [
  //   {
  //     name: 'Historical Data',
  //     data: [
  //       { name: 'January', value: 120, prediction: false },
  //       { name: 'February', value: 200, prediction: false },
  //       { name: 'March', value: 150, prediction: false },
  //       { name: 'April', value: 80, prediction: false },
  //       { name: 'May', value: 70, prediction: false },
  //       { name: 'June', value: 110, prediction: false },
  //     ].map((item) => ({
  //       ...item,
  //       itemStyle: {
  //         color: '#4C791B', // Color for historical data
  //       },
  //       label: {
  //         show: true,
  //         position: 'top',
  //         formatter: '',
  //         textStyle: {
  //           color: theme?.palette?.graph?.title || '#000',
  //         },
  //       },
  //     })),
  //   },
  //   {
  //     name: 'Prediction',
  //     data: [
  //       { name: 'July', value: 130, prediction: true },
  //     ].map((item) => ({
  //       ...item,
  //       itemStyle: {
  //         color: '#FF0000', // Color for prediction data
  //       },
  //       label: {
  //         show: true,
  //         position: 'top',
  //         formatter: `${predictionText} for ${item?.name}`,
  //         textStyle: {
  //           color: theme?.palette?.graph?.title || '#000',
  //         },
  //       },
  //     })),
  //   },
  // ];

  return (
    <BarChart
      chartId={chartId}
      // height="400px"
      series={dummyData}
      labelPostfix=""
      parentModule="AI-Engine"
    />
  );
};

export default PredictionBarChart;
