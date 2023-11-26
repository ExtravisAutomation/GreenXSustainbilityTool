// SiteDetail.js
import React from "react";
import { useParams } from "react-router-dom";

const SiteDetail = () => {
  const { id } = useParams();

  return <div style={{color:"#e5e5e5"}}>
  
  
  
  <div style={{display:"flex", justifyContent:"start", alignItems:"center",font:"bold",paddingLeft:"15px",   flexBasis:"100%", border:"1px solid #474747", height:"47px"}}> Site</div>
  
  <article style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"95%"}}>
  
  <div>
    <p>Region</p>
    <a>North America/ United State/ North Carolina</a>

  </div>
  <div>
    <p>Status</p>
    <p style={{ borderRadius:"20px", padding:"5px 10px",backgroundColor:"#71B626"}}>Active</p>

  </div>
  <div>
    <p>Facility</p>
    <p>DSW</p>

  </div>
  <div>
    <p>Physical Address</p>
    <a>3210 Faucette Dr., Raleigh, NC 2760757 Faucette</a>

  </div>
  </article>

  <article style={{display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:"70%"}}>
  
  <div>
    <p>Shipping Address</p>
    <a>3210 Faucette Dr., Raleigh, NC 2760757 Faucette Dr. </a>

  </div>
 
  <div>
    <p>Time Zone</p>
    <p>UAE</p>

  </div>
  <div>
    <p>GPS Coordinates</p>
    <p>-</p>

  </div>
  <div>
    <p>Description</p>
    <p>-</p>

  </div>
  </article>
  
  
  
  
  </div>;
};

export default SiteDetail;
