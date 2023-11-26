import React, { useEffect } from "react";
import * as echarts from 'echarts';
import Typography from "antd/es/typography/Typography";

const EmissionChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    let app = {};
    let option;

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const categories = (function () {
      let res = [];
      let len = 10;
      while (len--) {
        res.unshift(monthNames[len]); // Use month names instead of timestamp
      }
      return res;
    })();

    const data = (function () {
      let res = [];
      let len = 10;
      while (len--) {
        res.push(Math.round(Math.random() * 1000));
      }
      return res;
    })();

    const data2 = (function () {
      let res = [];
      let len = 0;
      while (len < 10) {
        res.push(+(Math.random() * 10 + 5).toFixed(1));
        len++;
      }
      return res;
    })();

    option = {
      // title: {
      //   text: 'CO2 Emission',
      //   textStyle: {
      //     color: '#e5e5e5' // Set the title font color
        
      //   }
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        }
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: categories,
        axisTick: {
          show: false
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
            formatter: '{value} kg'
          }
        },
      ],
      series: [
        {
          name: 'Dynamic Bar',
          type: 'bar',
          data: data
        },
        {
          name: 'Dynamic Line',
          type: 'line',
          data: data2
        }
      ]
    };

    app.count = 11;
    setInterval(function () {
      let monthIndex = new Date().getMonth();
      data.shift();
      data.push(Math.round(Math.random() * 1000));
      data2.shift();
      data2.push(+(Math.random() * 10 + 5).toFixed(1));
      categories.shift();
      categories.push(monthNames[monthIndex]);
      myChart.setOption({
        xAxis: {
          data: categories
        },
        series: [
          {
            data: data
          },
          {
            data: data2
          }
        ]
      });
    }, 2100);

    option && myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <>
      <Typography variant="h6" style={{ color: 'white', marginLeft: 30, marginTop: 15, fontSize:"1.25rem", fontWeight:"500", lineHeight:"20px" }}>
        CO2 Emission
      </Typography>
  
      <div id="main" style={{ width: "100%", height: "380px" }} />
    </>
  );
};

export default EmissionChart;
