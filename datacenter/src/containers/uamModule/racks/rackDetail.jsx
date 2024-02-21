import React from "react";
import { useParams } from "react-router-dom";
import device from "../../../resources/svgs/deviceone.png";
import devicedetail from "../../../resources/svgs/device1.png";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BackwardOutlined } from "@ant-design/icons";

function RackDetail() {
  const location = useLocation();
  const { data } = location.state || {};
  console.log(data, "datatatatata");
  const { id } = useParams();

  const navigate = useNavigate();

  const containerStyle = {
    position: "relative",
    paddingRight: "150px",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    right: "20",
  };
  return (
    <>
      <Button
        style={{
          marginTop: "20px",
          marginLeft: "1px",
          background: "transparent",
          color: "#E4E4E4",
          border: "unset",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          gap: "7px",
        }}
        onClick={() => navigate(-1)}
      >
        <BackwardOutlined />
        <p style={{ marginTop: "16.5px" }}>Rack</p>
      </Button>

      <div
        style={{
          display: "flex",
          color: "#e5e5e5",
          justifyContent: "space-between",
          padding: "5px 20px 20px 20px",
        }}
      >
        <div style={{ color: "#e5e5e5", width: "80%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "1px",
              padding: "5px 2px 0 18px",
              width: "100%",
              border: "1px solid #474747",
              height: "47px",
              borderRadius: "7px 7px 0px 0px ",
            }}
          >
            Rack Details
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
              font: "bold",
              padding: "10px",
              width: "100%",
              border: "1px solid #474747",
              height: "auto",
              borderRadius: "0px 0px 7px 7px",
            }}
          >
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Site Id</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.site_id}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>RFS</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.RFS}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Ru</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.Ru}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Tag Id</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.Tag_id}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Height</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.Height}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Depth</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.Depth}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Width</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.Width}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>floor</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.floor}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Rack Name</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.rack_name}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>manufacture_date</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.manufacture_date}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>PN Code</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.pn_code}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>id</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.id}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>serial Nnumber</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.serial_number}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Total Devices</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.total_devices}
                </div>
              </div>
              <div style={{ padding: "10px", width: "100%" }}>
                <label style={{ fontWeight: "bold" }}>Unit Position</label>
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "10px",
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: "#16212A",
                  }}
                >
                  {data.unit_position}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ paddingLeft: "10px", marginTop: "8px" }}>
                <label style={{ fontWeight: "bold" }}>Status</label>
                <p
                  style={{
                    marginTop: "5px",
                    marginTop: "5px",
                    borderRadius: "20px",
                    padding: "1px 25px 5px 25px",
                    backgroundColor:
                      data.status == "Active"
                        ? "#71B626"
                        : data.status == "In Active"
                        ? "rgb(216, 112, 83)"
                        : "rgb(86, 75, 133)",
                  }}
                >
                  {data.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
          }}
        >
          <img src={device} width={250} height={505} />
        </div>
      </div>
    </>
  );
}

export default RackDetail;
