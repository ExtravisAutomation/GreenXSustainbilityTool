import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import device from "../../../resources/svgs/device.png";
import devicedetail from "../../../resources/svgs/devicedetail.png";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchHmRackDetail } from "../../../store/features/dashboardModule/actions/hmRackClickAction";
import { Col, Row } from "antd";
import { BackwardOutlined } from "@ant-design/icons";
import BackButton from "../../../components/backButton";
function RedrackDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  // Access the siteId from the state object
  const siteId = state ? state.siteId : null;
  const rackId = state ? state.rackId : null;

  console.log(state, "state data");

  const rackDetail = useSelector((state) => state.hmRackDetail?.data);
  useEffect(() => {
    dispatch(fetchHmRackDetail(siteId, rackId));
  }, []);
  console.log(rackDetail, "rackDetail in gr");
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
      {/* <button
        className="back_btn"
        style={{
          background: "transparent",
          border: "none",
          color: "lightgray",
          marginLeft: "20px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginTop: "12px",
        }}
        onClick={() => navigate(-1)}
      >
        <BackwardOutlined />
        <span>Dashboard</span>
      </button> */}
      <BackButton
        style={{ marginLeft: "15px", marginTop: "12px" }}
      ></BackButton>
      <div
        style={{
          padding: "0 10px",
          color: "#e5e5e5",
        }}
      >
        <Row>
          <Col lg={14} style={{ padding: "10px" }}>
            <div
              style={{
                color: "#e5e5e5",
                fontSize: "15px",
                border: "1px solid #36424E",
                borderRadius: "7px",
                background: "#050C17",
                minHeight: "565px",
              }}
            >
              {rackDetail ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      font: "bold",
                      paddingLeft: "15px",
                      // maxWidth: "100%",
                      borderBottom: "1px solid #36424E",
                      height: "47px",
                    }}
                  >
                    Rack Detail
                  </div>

                  <div
                    style={{
                      alignItems: "start",
                      font: "bold",
                      maxWidth: "100%",
                      height: "400px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // marginBottom: "10px",
                        borderBottom: "1px solid #36424E",
                        padding: "15px",
                      }}
                    >
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Region</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.region}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Site</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.site_name}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Rack</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.rack_name}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Description
                        </label>
                        <div style={{ marginTop: "5px", color: "#0490E7" }}>
                          {rackDetail?.device_info?.device_name}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // marginBottom: "20px",
                        borderBottom: "1px solid #36424E",
                        padding: "15px",
                      }}
                    >
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>IP Address</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.ip_address}
                        </div>
                      </div>

                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Device Type
                        </label>
                        <div
                          style={{
                            color: "#0490E7",
                            marginTop: "5px",
                          }}
                        >
                          {rackDetail?.device_info?.device_type}
                        </div>
                      </div>

                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Serial No.</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.serial_number}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Model Number
                        </label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.pn_code}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // marginBottom: "20px",
                        borderBottom: "1px solid #36424E",
                        padding: "15px",
                      }}
                    >
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Hardware Version
                        </label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.hardware_version}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Software Version
                        </label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.software_version}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Status</label>
                        {/* <div style={{ marginTop: "5px" }}>
                        {rackDetail?.device_info?.status}
                      </div> */}
                        <div
                          style={{
                            marginTop: "10px",
                            background: "#71B62633",
                            color: "#C8FF8C",
                            width: "96px",
                            // height: "25px",
                            padding: "2px 0px 4px 0px",
                            borderRadius: "24px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: 400,
                          }}
                        >
                          {rackDetail?.device_info?.status}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Manufacturer
                        </label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.device_info?.manufacturer}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // marginBottom: "20px",
                        borderBottom: "1px solid #36424E",
                        padding: "15px",
                      }}
                    >
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Input Power
                        </label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.input_power} W
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Energy Efficiency
                        </label>
                        <div
                          style={{
                            marginTop: "5px",
                            width: "60px",
                            borderRadius: "20px",
                            textAlign: "center",
                            padding: "2px 0px 4px 0px",

                            background:
                              rackDetail?.total_power > 85 ? "green" : "red",
                          }}
                        >
                          {rackDetail?.total_power}%
                        </div>
                      </div>

                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Cost</label>
                        <div style={{ marginTop: "5px" }}>
                          AED {rackDetail?.cost_of_power}
                        </div>
                      </div>
                      <div style={{ width: "25%" }}>
                        <label style={{ fontWeight: "bold" }}>Traffic</label>
                        <div style={{ marginTop: "5px" }}>
                          {rackDetail?.traffic_throughput} GB/s
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "500px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>No Data Found</div>
                </div>
              )}
            </div>
          </Col>
          <Col lg={10} style={{ padding: "10px" }}>
            <div
              style={{
                position: "relative",
                border: "1px solid #36424E",
                borderRadius: "7px",
                background: "#050C17",
                padding: "15px",
              }}
            >
              <img src={device} width={250} height={530} />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default RedrackDetail;
