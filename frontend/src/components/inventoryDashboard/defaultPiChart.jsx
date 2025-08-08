import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@mui/material/styles';

const DefaultPiChart = ({
  data,
  title,
  radius,
  totalValue,
  height = '245px',
  color = null,
}) => {
  const chartRef = useRef(null);
  const theme = useTheme();
  console.log('Data on PI chart::::', data);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const options = {
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: theme?.palette?.graph?.toolTip_bg,
        borderColor: theme?.palette?.graph?.tooltip_border,
        borderWidth: 1,
        textStyle: {
          color: theme?.palette?.graph?.title,
          fontSize: 12,
        },
        // trigger: 'item',
      },
      legend: {
        bottom: '0%',
        left: 'start',
        icon: 'circle',
        textStyle: {
          color: theme.palette?.main_layout?.primary_text,
        },
      },
      title: {
        text: `${totalValue == 'false' ? '' : totalValue}`,
        subtext: totalValue == 'false' ? '' : `Total`,
        left: 'center',
        // top: '38%',
        top: '33%',
        textStyle: {
          fontSize: 16,
          fontWeight: 700,
          color: theme.palette?.main_layout?.primary_text,
        },
        subtextStyle: {
          fontSize: 12,
          fontWeight: 500,
          color: theme.palette?.main_layout?.primary_text,
        },
        itemGap: 5,
      },
      series: [
        {
          type: 'pie',
          // radius: [totalValue == 'false' ? '0%' : '50%', radius],
          // radius: ['60%', radius],
          // center: ['50%', '40%'],
          radius: [totalValue == 'false' ? '0%' : '50%', radius], // changed from '25%' to '60%'
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          minAngle: 5,
          itemStyle: {
            borderWidth: 3,
            borderColor:
              theme?.mode === 'dark'
                ? theme?.palette?.default_card?.background
                : '#fff',
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          // data: data,
          data: data?.map((item, index) => ({
            ...item,
            itemStyle: {
              color: color
                ? color[index]
                : index === 0
                  ? theme.palette?.main_layout?.secondary_text
                  : '',
            },
          })),
        },
      ],
      animation: false,
    };

    chartInstance.setOption(options);

    const handleResize = () => {
      chartInstance.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: radius == '80%' ? '270px' : height,
      }}
    />
  );
};

export default DefaultPiChart;
