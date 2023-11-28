import React from "react";
import GraphBox from "./graphBox";
import Typography from "antd/es/typography/Typography";
import { useNavigate } from "react-router-dom";

function HeatmapChart() {
  const navigate = useNavigate();

  const handleGraphBoxClick = (rackId) => {
    navigate(`inventorydetail`);
  };
  return (
    <div
      style={{
        border: "1px solid #36424E",
        borderRadius: "7px",
        minWidth: "40%",
        color: "#e5e5e5",
      }}
    >
      <Typography
        variant="h6"
        style={{
          color: "white",
          marginLeft: 15,
          marginTop: 15,
          fontSize: "1.25rem",
          fontWeight: "500",
          lineHeight: "20px",
        }}
      >
        Heat Map of Racks{" "}
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      >
        <GraphBox
          backgroundColor="#02A0FC"
          onClick={() => handleGraphBoxClick("rack1")}
        />
        <GraphBox
          backgroundColor="#02A0FC"
          onClick={() => handleGraphBoxClick("rack2")}
        />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#249b38" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      >
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#249b38" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      >
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#36393b" />
        <GraphBox backgroundColor="#7a0802" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      >
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#02A0FC" />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#02A0FC" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      >
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#249b38" />
        <GraphBox backgroundColor="#7a0802" />
        <GraphBox backgroundColor="#02A0FC" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px 0px 20px",
        }}
      ></div>

      <div style={{ padding: "11.7px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: "white",
              marginLeft: 5,
              marginTop: 15,
              fontSize: "15px",
              fontWeight: "500",
              lineHeight: "20px",
            }}
          >
            Racks by Strength{" "}
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "350px",
              paddingTop: "15px",
            }}
          >
            <label>Ru42</label>
            <div
              style={{
                background: " #7a0802",
                height: "15px",
                width: "15px",
                borderRadius: "3px",
              }}
            ></div>
            <label>Ru42 </label>

            <div
              style={{
                background: " #249b38",
                height: "15px",
                width: "15px",
                borderRadius: "3px",
              }}
            ></div>

            <label>Ru42 </label>

            <div
              style={{
                background: " #02A0FC",
                height: "15px",
                width: "15px",
                borderRadius: "3px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatmapChart;
