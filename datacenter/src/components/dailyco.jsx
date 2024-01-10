import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";
import CostInternalChart from "../components/costInternalChart.jsx";
import Co from "../components/co.jsx";
import worldmap from "../resources/svgs/uaemap1.png";
import dots from "../resources/svgs/dots.svg";
import uaerealmap from "../resources/svgs/uaerealmap.png";

function dailyco(props) {
  const handleMouseEnter = (event, info) => {
    // Use the event and info to show more information or update the state
    console.log("Mouse Enter", info);
  };

  const handleMouseLeave = (event) => {
    // Use the event to hide or reset the information
    console.log("Mouse Leave");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#e5e5e5",
          padding: "0px 10px",
        }}
      >
        <img src={props.headericon} height={35} width={35} />
        <p
          style={{
            padding: "15px",
            margin: "0px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          {props.heading}{" "}
        </p>
      </div>
      <p
        style={{
          color: "#e5e5e5",
          padding: "0px 0px 10px 60px",
          margin: "0px ",
        }}
      >
        About 80% of your Energy this month came from low-carbon sources on
        average, with solar making up the majority
      </p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            border: "1px solid #36424E",
            margin: "5px 20px",
            height: "370px",
            borderRadius: "7px",
            color: "#e5e5e5",
            //   border:"3px solid red",
            flexBasis: "30%",
            height: "450px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px",
              alignItems: "center",
              color: "#e5e5e5",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                flexDirection: "column",
                alignItems: "start",
                color: "#e5e5e5",
                padding: "20px 20px",
              }}
            >
              <p style={{ padding: "0px", margin: "0px", fontWeight: "bold" }}>
                Total C02 Emissions (Per Site){" "}
              </p>
              {/* <p style={{padding:"10px 0px", margin:"0px", fontWeight:"bold", fontSize:"40px", color:"#ac1717"}}>AED  </p> */}
              <p>
                Two of your sites have higher emissions than your fabric's
                average
              </p>
              <p style={{ padding: "0px", margin: "0px", fontWeight: "bold" }}>
                Abu Dhabi
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ marginRight: "5px" }}>&#8226;</span> CO2 Emission
                15kg <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> AED 7500{" "}
                <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> Energy
                Consumption 7000 KW
              </p>{" "}
              <p style={{ padding: "0px", margin: "0px", fontWeight: "bold" }}>
                Dubai
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ marginRight: "5px" }}>&#8226;</span> CO2 Emission
                20kg <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> AED 8000{" "}
                <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> Energy
                Consumption 7500 KW
              </p>{" "}
              <p style={{ padding: "0px", margin: "0px", fontWeight: "bold" }}>
                Sharjah
              </p>
              <p style={{ fontSize: "14px" }}>
                <span style={{ marginRight: "5px" }}>&#8226;</span> CO2 Emission
                20kg <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> AED 8000{" "}
                <br />
                <span style={{ marginRight: "5px" }}>&#8226;</span> Energy
                Consumption 7500 KW
              </p>{" "}
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #36424E",
            margin: "0px 20px",
            height: "370px",
            borderRadius: "7px",
            color: "#e5e5e5",
            flexBasis: "70%",
            height: "460px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "0px",
            }}
          >
            <div
              className="cost-graph-wrapper"
              style={{
                position: "relative",
                borderRadius: "10px",
              }}
            >
              {/* Main image */}
              <img
                src={uaerealmap}
                alt="UAE Map"
                width={760}
                height={450}
                style={{ top: "50" }}
              />

              {/* Dots image overlay 1 */}
              <img
                src={dots}
                alt="Dots Image 1"
                title="Dubai  [CO2 Emission : 20kg ,Cost : AED 8000 , Energy Consumption : 7500 KW]"
                style={{
                  position: "absolute",
                  top: 125,
                  left: 545,
                  width: "5%",
                  height: "5%",
                  opacity: 1,
                }}
              />

              {/* Dots image overlay 2 */}
              <img
                src={dots}
                alt="Dots Image 2"
                title="Sharjah  [CO2 Emission : 20kg ,Cost : AED 8000 , Energy Consumption : 7500 KW]"
                style={{
                  position: "absolute",
                  top: 45,
                  left: 645,
                  width: "5%",
                  height: "5%",
                  opacity: 1,
                }}
              />

              {/* Dots image overlay 3 */}
              <img
                src={dots}
                alt="Dots Image 3"
                title="Abu dhabi  [CO2 Emission : 15kg ,Cost : AED 7500 , Energy Consumption : 7000 KW]"
                style={{
                  position: "absolute",
                  top: 235,
                  left: 425,
                  width: "5%",
                  height: "5%",
                  opacity: 1, // Adjust the opacity as needed
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dailyco;
