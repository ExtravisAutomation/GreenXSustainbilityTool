import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: props.series,
      options: {
        chart: {
          type: 'donut',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        labels: ['Solar', 'Natural Gas', 'Wind', 'Coal'], // Set labels for each segment of the donut chart
        legend: {
          show: true,
          position: 'bottom', // Display the legend at the bottom
          fontSize: '14px', // Set the font size of the legend
          labels: {
            colors: ['#e5e5e5', '#e5e5e5', '#e5e5e5', '#e5e5e5'], // Set label colors
          },
        },
      }, // Correct the placement of this closing brace
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
      </div>
    );
  }
}

class EnergyMix extends React.Component {
  render() {
    const updatedSeries = [58, 20, 12, 10]; // Remaining percentage assigned to Coal

    return (
      <div style={{ flexDirection: 'column', width: '60%', color: '#e5e5e5', paddingLeft: '0px' }}>
        <p style={{ fontSize: '25px', fontWeight: 'bold' }}>Energy Mix</p>
        <ApexChart series={updatedSeries} />
        <p style={{ fontSize: '25px', fontWeight: 'bold' }}>Energy Mix</p>

      </div>
    );
  }
}

export default EnergyMix;
