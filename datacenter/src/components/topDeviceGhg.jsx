import React from "react";
import headericon from "../resources/svgs/logo.svg";
import Seprater from "../components/seprater.jsx";
import arrow from "../../src/resources/svgs/arrow.png";

function topDevicesGhg(props) {
    
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
          <h4 style={{ margin: "0px", padding: "0px" }}>AA_Alaska</h4>
          <p style={{ margin: "0px", padding: "0px" }}>138 kg CO2e</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>AB_Alaska</h4>
          <p style={{ margin: "0px", padding: "0px" }}>138 kg CO2e</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>SJ-Switch-1a</h4>
          <p style={{ margin: "0px", padding: "0px" }}>110 kg CO2e</p>
          </div>
          <img src={arrow} width={20} height={20} />
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>AC_Alaska</h4>
          <p style={{ margin: "0px", padding: "0px" }}>104 kg CO2e</p>
          </div>
          <img src={arrow}  width={20} height={20}/>
        </div>
        <Seprater/>
        <div style={{  display: "flex",  justifyContent: "space-between",padding:"15px",alignItems: "center" , color:"#e5e5e5"}}>
            <div>
          <h4 style={{ margin: "0px", padding: "0px" }}>AD_Alaska</h4>
          <p style={{ margin: "0px", padding: "0px" }}>103 kg CO2e</p>
          </div>
          <img src={arrow} width={20} height={20}/>
        </div>
        {/* <Seprater/> */}
        </div>
      </div>
    </div>
  );
}

export default topDevicesGhg;
