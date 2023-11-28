import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Typography from 'antd/es/typography/Typography';

const Co = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    chartRef.current = myChart;

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const generateData = () => {
      const data = [];
      let len = 10;
      while (len--) {
        data.push(Math.round(Math.random() * 1000));
      }
      return data;
    };

    const categories = (function () {
      let res = [];
      let len = 10;
      while (len--) {
        res.unshift(monthNames[len]);
      }
      return res;
    })();

    const data = generateData();

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56',
          },
        },
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
        iconStyle: {
          borderColor: '#e5e5e5',
        },
        emphasis: {
          iconStyle: {
            color: '#e5e5e5',
          },
        },
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: categories,
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#e5e5e5',
        },
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: 'CO2 Emission (kg)',
          max: 1200,
          min: 0,
          boundaryGap: [0.2, 0.2],
          axisLabel: {
            formatter: '{value} kg',
            color: '#e5e5e5',
          },
        },
      ],
      series: [
        {
          name: 'Sustainable Operations Emissions',
          type: 'bar',
          data: data,
        },
      ],
    };

    setInterval(() => {
      let monthIndex = new Date().getMonth();
      let newMonthName = monthNames[monthIndex];

      if (!categories.includes(newMonthName)) {
        data.shift();
        data.push(Math.round(Math.random() * 1000));
        categories.shift();
        categories.push(newMonthName);

        chartRef.current.setOption({
          xAxis: {
            data: categories,
          },
          series: [
            {
              data: data,
            },
          ],
        });
      }
    }, 2100);

    option && chartRef.current.setOption(option);

    return () => {
      chartRef.current.dispose();
    };
  }, []);

  return (
    <>
      <Typography
        variant="h6"
        style={{
          color: 'white',
          marginLeft: 10,
          marginTop: 15,
          fontSize: '1.25rem',
          fontWeight: '500',
          lineHeight: '20px',
        }}
      >
        CO2 Emission
      </Typography>

      <div id="main" style={{ width: '100%', height: '380px' }} />
    </>
  );
};

export default Co;
