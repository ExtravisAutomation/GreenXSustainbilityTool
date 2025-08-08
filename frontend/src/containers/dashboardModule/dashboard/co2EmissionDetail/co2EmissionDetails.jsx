import React from "react";
import CustomStepProgress from "./customStepProgress";
import CustomCard from "../../../../components/customCard";
import { useTheme } from "@mui/material/styles";
import { Col, Row } from "antd";

const Co2EmissionDetails = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "99%",
        margin: "0 auto",
        paddingTop: "10px",
      }}
    >
      <Row gutter={[10, 10]}>
        <Col xl={13}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              position: "relative",
              padding: "0 10px 10px 10px",
            }}
          >
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Switch-n
            </p>
            <CustomStepProgress
              steps={57}
              percent={60}
              size={[10, 80]}
              stepColor="#ccc"
              activeStepColor={theme?.palette?.main_layout?.secondary_text}
            />
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Switch-3
            </p>
            <CustomStepProgress
              steps={57}
              percent={60}
              size={[10, 80]}
              stepColor="#ccc"
              activeStepColor={theme?.palette?.main_layout?.secondary_text}
            />
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Switch-2
            </p>
            <CustomStepProgress
              steps={57}
              percent={60}
              size={[10, 80]}
              stepColor="#ccc"
              activeStepColor={theme?.palette?.main_layout?.secondary_text}
            />
            <p
              style={{
                color: theme?.palette?.main_layout?.primary_text,
                fontWeight: 500,
                marginBottom: "2px",
              }}
            >
              Switch-1
            </p>
            <CustomStepProgress
              steps={90}
              value={194}
              percent={60}
              customUnit="W"
              size={[6, 80]}
              stepColor="#ccc"
              activeStepColor={theme?.palette?.main_layout?.secondary_text}
            />
          </CustomCard>
        </Col>
        <Col xl={4}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              position: "relative",
              padding: "0 10px 10px 10px",
            }}
          ></CustomCard>
        </Col>
        <Col xl={4}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              position: "relative",
              padding: "0 10px 10px 10px",
            }}
          ></CustomCard>
        </Col>
        <Col xl={3}>
          <CustomCard
            style={{
              border: `1px solid ${theme?.palette?.default_card?.border}`,
              backgroundColor: theme?.palette?.main_layout?.background,
              borderRadius: "7px",
              position: "relative",
              padding: "0 10px 10px 10px",
            }}
          ></CustomCard>
        </Col>
      </Row>
    </div>
  );
};

export default Co2EmissionDetails;
