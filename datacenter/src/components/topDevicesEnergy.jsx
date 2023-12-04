import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";

function topDevicesEnergy(props) {
    
  return (
    <div >
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          color: "#e5e5e5",
          padding:"0px 10px",
        //   height:"450px"
        }}
      >
        <img src={props.headericon} height={35} width={35} />
        <p style={{padding:"15px", margin:"0px", fontWeight:"bold"}}>{props.heading} </p>
      </div>

      <div
        style={{
          border: "2px solid #36424E",
          margin: "5px 20px",
          height: "370px",
          borderRadius: "7px",
          color: "#e5e5e5"
        }}
      >
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>Device A</h4>
          <p style={{ margin: "0px", padding: "0px" }}>2.2 kWh enery Consumed</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>Device B</h4>
          <p style={{ margin: "0px", padding: "0px" }}>2.1 kWh enery Consumed</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>Device C</h4>
          <p style={{ margin: "0px", padding: "0px" }}>1.8 kWh enery Consumed</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>Device D</h4>
          <p style={{ margin: "0px", padding: "0px" }}>1.0 kWh enery Consumed</p>
          </div>
          <img src={arrow}  width={20} height={20}/>
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>Device E</h4>
          <p style={{ margin: "0px", padding: "0px" }}>2.2 kWh enery Consumed</p>
          </div>
          <img src={arrow} width={20} height={20}/>
        </div>
        {/* <Seprater/> */}
        </div>
      </div>
    </div>
  );
}

export default topDevicesEnergy;
