import React from "react";
import { Collapse, Row, Col } from "antd";
import "./index.css";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const CustomAccordion = ({ data, hardware }) => {
  const theme = useTheme();
  const StyledCollapse = styled(Collapse)`
    &.ant-collapse {
      border: unset !important;
      background-color: #16212a !important;
      border-radius: 0px !important;
    }

    .ant-collapse-item {
      border: 1px solid ${theme?.palette?.default_accordion?.border} !important;
      background-color: #16212a !important;
      border-radius: 0px !important;
    }

    .ant-collapse-header {
      border-radius: 0px !important;
      border-bottom: 1px solid ${theme?.palette?.default_accordion?.border} !important;
      color: ${theme?.palette?.default_accordion?.primary_text} !important;
      background-color: ${theme?.palette?.default_accordion
        ?.background} !important;
    }

    .ant-collapse-content-box {
      padding: 0px 0px 0px 0px !important;
      color: ${theme?.palette?.default_card?.color} !important;
      background-color: ${theme?.palette?.default_select
        ?.background} !important;
      margin: 0px !important;
    }
  `;

  const StyledTable = styled.table`
    width: 100%;
  `;

  const StyledTd = styled.td`
    border-right: 1px solid ${theme?.palette?.default_accordion?.border};
    border-bottom: 1px solid ${theme?.palette?.default_accordion?.border};
    width: 50% !important;
  `;

  const StyledP = styled.p`
    padding: 10px 10px;
    margin: 0px;
    width: 100% !important;
  `;
  return (
    <StyledCollapse accordion>
      {hardware == "true" ? (
        <>
          <Collapse.Panel header={"CPU"}>
            <StyledTable style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>No of CPUs</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.num_cpus} CPUs</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Processor</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.processor_type}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Memory</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.total_memory_GB}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>
          <Collapse.Panel header={"Hard disk"}>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>{data?.hard_disks[0].name}</StyledP>
                  </StyledTd>
                  <StyledTd style={{}}>
                    <StyledP>
                      <span>{data?.hard_disks[0].size_MB}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>

          <Collapse.Panel header={"USB Controller"}>
            <StyledTable>
              <tbody>
                <tr style={{}}>
                  <StyledTd>
                    <StyledP>{/* Number of disks */}</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{/* <span>{data?.num_disks}</span> */}</StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>

          <Collapse.Panel header={"Other Hardwares"}>
            <div>
              <StyledTable>
                <tbody>
                  {data?.other_hardware.map((item, index) => (
                    <tr key={index}>
                      <StyledTd>
                        <StyledP>{item.hardware_name}</StyledP>
                      </StyledTd>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </div>
          </Collapse.Panel>
        </>
      ) : (
        <>
          <Collapse.Panel header={"Networking"}>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>Host Name</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.hostname}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>IP Address</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.ip_address}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>
          <Collapse.Panel header={"VMware Tools"}>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>VMWare Tools</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.vmware_tools}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>

          <Collapse.Panel header={"Storage"}>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>Number of disks</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.num_disks}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Total Disk GB</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.total_disk_GB}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </Collapse.Panel>
        </>
      )}
    </StyledCollapse>
  );
};

export default CustomAccordion;
