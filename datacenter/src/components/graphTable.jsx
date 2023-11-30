import React, { useState } from "react";
import "./graphTable.css";
import Typography from "antd/es/typography/Typography";
import "./../../src/index.css";

const Table = () => {
  // Sample data for the table
  const tableData = [
    { name: "Rack AA", cost: 40, power: 30, hoverLabels: { energy: 55.56, maintenance: 27.78, cooling: 16.67 } },
    { name: "Rack AB", cost: 50, power: 40, hoverLabels: { energy: 60.0, maintenance: 25.0, cooling: 15.0 } },
    { name: "Rack AC", cost: 60, power: 35, hoverLabels: { energy: 50.0, maintenance: 30.0, cooling: 20.0 } },
    { name: "Rack AD", cost: 20, power: 45, hoverLabels: { energy: 45.0, maintenance: 35.0, cooling: 20.0 } },
  ];

  const [isHovered, setHovered] = useState(null);

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        className="graph-table-heading"
        style={{ color: "#E5E5E5", padding: "8px 0px 2px 15px" }}
      >
        Top Racks by Cost and Input Power Utilization{" "}
      </Typography>
      <table style={{ width: "100%", marginTop: "20px", borderRadius: "7px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Input Power</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <td style={{ color: "#0490e7" }}>{item.name}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "80px",
                    height: "35px",
                    borderRadius: "7px",
                    position: "relative",
                  }}
                >
                  {`AED ${item.cost}`}
                  <div
                    className="percentage-bar cost"
                    style={{
                      width: `${item.cost}%`,
                      borderRadius: "20px",
                    }}
                  >
                    {isHovered === index && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "white",
                          textAlign: "center",
                          fontSize: "12px",
                          backgroundColor: "#e5e5e5", // Set the background color
                          padding: "8px",
                          borderRadius: "5px",
                          color:"black"
                        }}
                      >
                        <div>{`Energy: ${item.hoverLabels.energy.toFixed(2)}%`}</div>
                        <div>{`Maintenance: ${item.hoverLabels.maintenance.toFixed(2)}%`}</div>
                        <div>{`Cooling: ${item.hoverLabels.cooling.toFixed(2)}%`}</div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "35px",
                }}
              >
                {`${item.power} kWh`}
                <div
                  className="percentage-bar power"
                  style={{
                    width: `${item.power}%`,
                    borderRadius: "20px",
                    color: "#4C791B",
                  }}
                ></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
