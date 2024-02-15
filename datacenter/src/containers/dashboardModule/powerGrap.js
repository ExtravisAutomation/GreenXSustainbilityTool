import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: props.series,
      options: {
        chart: {
          type: "donut",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        width: "100%", // Adjust the width of the chart
        labels: ["Solar"],
        legend: {
          show: true,
          position: "bottom",
          fontSize: "14px",
          labels: {
            colors: ["#e5e5e5"],
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="donut"
        />
      </div>
    );
  }
}

class PowerGrap extends React.Component {
  render() {
    const updatedSeries = [58, ""];

    return (
      <div style={{ color: "#e5e5e5", width: "50%" }}>
        <p style={{ fontSize: "25px", fontWeight: "bold" }}>Energy Mix</p>
        <ApexChart series={updatedSeries} />
      </div>
    );
  }
}

export default PowerGrap;
