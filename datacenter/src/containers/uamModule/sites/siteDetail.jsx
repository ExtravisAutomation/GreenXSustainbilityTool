// SiteDetail.js
import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BackwardOutlined } from "@ant-design/icons";

const SiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  // console.log(data, "state record");

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
        <p style={{ marginTop: "16.5px" }}>Site</p>
      </Button>
      <div style={{ color: "#e5e5e5", padding: "5px 20px 20px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            font: "bold",
            paddingLeft: "15px",
            flexBasis: "100%",
            border: "1px solid #36424E",
            borderRadius: "5px",
            height: "47px",
            marginBottom: "10px",
          }}
        >
          Site Details
        </div>
        <div
          style={{
            border: "1px solid #36424E",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <article
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Region</p>
              <a>{data.region}</a>
            </div>
            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>City</p>
              <a>{data.city}</a>
            </div>

            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Site Name</p>
              <p>{data.site_name}</p>
            </div>
            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Site Type</p>
              <a> {data.site_type}</a>
            </div>
          </article>
          <article
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Total Devices</p>
              <p>{data.total_devices}</p>
            </div>

            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Latitude</p>
              <p>{data.latitude}</p>
            </div>

            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Longitude</p>
              <p>{data.longitude}</p>
            </div>
            <div
              style={{
                textAlign: "start",
                width: "100%",
              }}
            >
              <p>Status</p>
              <p
                style={{
                  borderRadius: "20px",
                  padding: "1px 20px 5px 20px",
                  backgroundColor: "#71B626",
                  width: "45px",
                  textAlign: "center",
                }}
              >
                {data.status}
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default SiteDetail;
