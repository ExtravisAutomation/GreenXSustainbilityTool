import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const EChartsGauge = ({
  data,
  cpu,
  memory,
  pue,
  inventory,
  customColor = null,
  axisTick = false,
  pointerOptions = {
    show: false,
  },
  id = 'echarts-gauge',
}) => {
  const theme = useTheme();

  const percentage = cpu ? data / 100 : data;
  let colorRange;

  if (!cpu && percentage < 0.5) {
    // Less than 50%
    colorRange = [
      [percentage, '#FF6347'],
      [1, '#D9D9D9'],
    ];
  } else if (!cpu && percentage <= 0.8) {
    // Between 50% and 80%
    // colorRange = [
    //   [percentage, '#6495ED'],
    //   [1, '#D9D9D9'],
    // ];
    colorRange = [
      [percentage, `${theme?.palette?.graph?.graph_area?.secondary_line}`],
      [1, `${theme?.palette?.graph?.graph_area?.secondary_line}`],
    ];
  } else if (!cpu && percentage > 0.8) {
    // Greater than 80%
    // colorRange = [
    //   [percentage, 'green'],
    //   [1, 'green'],
    // ];
    colorRange = [
      [percentage, `${theme?.palette?.main_layout?.secondary_text}`],
      [1, `${theme?.palette?.main_layout?.secondary_text}`],
    ];
  } else if (pue && !cpu && percentage <= 0.9) {
    // colorRange = [
    //   [percentage, 'green'],
    //   [1, 'green'],
    // ];
    colorRange = [
      [percentage, `${theme?.palette?.main_layout?.secondary_text}`],
      [1, `${theme?.palette?.main_layout?.secondary_text}`],
    ];
  } else {
    colorRange = [
      [percentage, '#3CB371'],
      [1, '#D9D9D9'],
    ];
  }

  useEffect(() => {
    const chartDom = document.getElementById(memory === 'true' ? 'a' : id);
    const myChart = echarts.init(chartDom);

    const option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '98%',
          axisLine: {
            lineStyle: {
              width: 30,
              color: customColor || colorRange,
            },
          },
          pointer: pointerOptions,
          axisTick: {
            show: axisTick,
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#f5f4f2',
              width: 1,
            },
          },
          axisLabel: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            show: true,
            offsetCenter: [0, '5%'],
            formatter: function (value) {
              return cpu === 'true'
                ? `{a|${value}}\n{b|%}`
                : pue || inventory
                  ? value
                  : `{a|${value}%}\n{b|usage}`;
            },
            rich: {
              a: {
                color: theme?.palette?.main_layout?.primary_text,
                fontSize: 16,
                fontWeight: 600,
              },
              b: {
                color: '#77838F',
                fontSize: 20,
              },
            },
            color: theme?.palette?.main_layout?.primary_text,

            fontSize: 30,
          },
          data: [
            {
              value: cpu ? percentage * 100 : data,
            },
          ],
        },
      ],
    };

    myChart.setOption(option);

    const updateChart = () => {
      myChart.setOption({
        series: [
          {
            data: [
              {
                value: cpu ? percentage * 100 : data,
              },
            ],
          },
        ],
      });
    };

    const intervalId = setInterval(updateChart, 2000);

    return () => clearInterval(intervalId);
  }, [data, colorRange, cpu, memory, percentage]);

  return (
    <div
      id={memory === 'true' ? 'a' : id}
      style={{
        height: '200px',
        marginTop: '0px',
      }}
    />
  );
};

export default EChartsGauge;
