import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const SiteGraphChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById('site-graph-chart');
    const myChart = echarts.init(chartDom, 'dark');

    myChart.showLoading();

    fetch('https://echarts.apache.org/examples/data/asset/geo/HK.json')
      .then((response) => response.json())
      .then((geoJson) => {
        myChart.hideLoading();
        echarts.registerMap('HK', geoJson);
        myChart.setOption({
          title: {
            text: 'Population Density of Hong Kong (2011)',
            subtext: 'Data from Wikipedia',
            sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} (p / km2)',
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          visualMap: {
            min: 800,
            max: 50000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered'],
            },
          },
          series: [
            {
              name: 'Population Density of Hong Kong',
              type: 'map',
              map: 'HK',
              label: {
                show: true,
              },
              data: [
                { name: '中西区', value: 20057.34 },
                { name: '湾仔', value: 15477.48 },
                { name: '东区', value: 31686.1 },
                // Add more data as needed
              ],
              nameMap: {
                'Central and Western': '中西区',
                Eastern: '东区',
                // Add more name mappings as needed
              },
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return <div id="site-graph-chart" style={{ width: '100%', height: '600px' }} />;
};

export default SiteGraphChart;
