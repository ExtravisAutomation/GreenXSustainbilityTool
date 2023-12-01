import React from "react";
import { useParams } from "react-router-dom";
import device from "../../../resources/svgs/deviceone.png"
import devicedetail from "../../../resources/svgs/device1.png"

function RackDetail() {
  const { id } = useParams();
  const containerStyle = {
    position: 'relative',
    paddingRight: '150px',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '0',
    right: '20',
  };
  return (
    <div style={{display:"flex",color:"#e5e5e5", justifyContent:"space-between"}}>
    <div style={{color:"#e5e5e5"}}>
          <div style={{display:"flex", justifyContent:"start", alignItems:"center",font:"bold",paddingLeft:"15px",   maxWidth:"100%", border:"1px solid #474747", height:"47px", borderRadius:"7px 7px 0px 0px "}}> Rack</div>
          <div style={{display:"flex",flexDirection:"column", justifyContent:"start", alignItems:"start",font:"bold",paddingLeft:"15px",   maxWidth:"100%", border:"1px solid #474747", height:"400px", borderRadius:"0px 0px 7px 7px"}}> 
          
          <div style={{display:"flex"}}>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Site</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>DXB</div>
          </div>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Height</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>42</div>
          </div>
          </div>
          <div style={{display:"flex"}}>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Role</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>Infrastructure</div>
          </div>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Description</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>-</div>
          </div>
          </div>
          <div style={{display:"flex"}}>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Serial Number</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>-</div>
          </div>
          <div style={{padding:"10px"}}>
          <label style={{fontWeight:"bold"}}>Asset Tag</label>
          <div style={{display:"flex", alignItems:"center",paddingLeft:"10px", width:"260px", height:"40px", borderRadius:"8px",backgroundColor:"#16212A"}}>-</div>
          </div>
          </div>
          <div style={{paddingLeft:"10px"}}>
          <label style={{fontWeight:"bold"}}>Status</label>
          <p style={{ borderRadius:"20px", padding:"10px 20px",backgroundColor:"#71B626"}}>Active</p>
          </div>
          
          
          </div>


        
          

    </div>
    
    <div style={{paddingRight:"50px",position: "relative", paddingRight: "150px" }}>
    <img src={device} width={250} height={550}/>
    {/* <img src={devicedetail} style={overlayStyle}/> */}
    </div>
    </div>
  );
}

export default RackDetail;
