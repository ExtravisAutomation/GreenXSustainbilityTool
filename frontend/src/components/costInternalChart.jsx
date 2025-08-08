import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as echarts from "echarts";

const CostInternalChart = () => {
  const navigate = useNavigate();

  const data = [
    { value: 40, name: "DXB-40%" },
    { value: 10, name: "SHJ-10%" },
    { value: 15, name: "AUH-15%" },
    { value: 8, name: "FUJ-8%" },
    { value: 6, name: "RAK-6%" },
    { value: 7, name: "UAQ-7%" },
    { value: 7, name: "AJM-7%" },
    { value: 6, name: "AAN-6%" },
  ];

  useEffect(() => {
    const chartDom = document.getElementById("cost-internal-chart");

    if (!chartDom) {
      console.error("Element with ID 'cost-internal-chart' not found.");
      return;
    }

    const myChart = echarts.init(chartDom);

    myChart.on("click", (params) => {
      if (params.data && params.data.name) {
        // Navigate to the sitedetail page with the site name as a parameter
        navigate(`/main_layout/uam_module/sites`);
      }
    });

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "95%",
        left: "center",
        textStyle: {
          color: "#e5e5e5",
        },
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["40%", "80%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "transparent",
            borderWidth: 0,
          },
          label: {
            show: true,
            position: "outside",
            color: "#e5e5e5",
            formatter: "{b}: {d}%",
            emphasis: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
            length: 5,
          },
          data: data,
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, [data, navigate]);

  return (
    <div
      id="cost-internal-chart"
      style={{ width: "100%", height: "400px", marginTop: "20px" }}
    />
  );
};

export default CostInternalChart;
