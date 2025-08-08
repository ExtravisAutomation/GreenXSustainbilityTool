import React from "react";
import { Collapse, Row, Col } from "antd";
import "./index.css";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
const CustomAccordion = ({ data, hardware, host }) => {
  const theme = useTheme();
  const StyledCollapse = styled(Collapse)`
    &.ant-collapse {
      border: unset !important;
      border: 1px solid ${theme?.palette?.default_accordion?.border} !important;
      background-color: ${theme?.palette?.default_accordion
        ?.background} !important;
      color: ${theme?.palette?.default_accordion?.primary_text} !important;

      border-radius: 0px !important;
    }

    .ant-collapse-item {
      border: 1px solid ${theme?.palette?.default_accordion?.border} !important;
      background-color: ${theme?.palette?.default_accordion
        ?.background} !important;
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
    <>
      {host == "true" ? (
        <>
          <StyledCollapse accordion>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledTd>
                    <StyledP>Name</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.name}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Manufacturer</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.manufacturer}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Default Gateway</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.default_gateway}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>DNS Servers</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.dns_servers}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Host Name</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.host_name}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>IP Address</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.ip_address}</StyledP>
                  </StyledTd>
                </tr>

                <tr>
                  <StyledTd>
                    <StyledP>Model</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.model}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>State</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>{data?.state}</StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Version</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.version}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Virtual Flash</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.virtual_flash}</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Total Memory</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.total_memory_gb} GB</span>
                    </StyledP>
                  </StyledTd>
                </tr>
                <tr>
                  <StyledTd>
                    <StyledP>Total CPU</StyledP>
                  </StyledTd>
                  <StyledTd>
                    <StyledP>
                      <span>{data?.total_cpu_mhz} mhz</span>
                    </StyledP>
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
            <Collapse.Panel header={"Networkings"}>
              <StyledTable>
                <tbody>
                  {data?.networkings.map((network) => (
                    <tr>
                      <StyledTd>
                        <StyledP>
                          <span>{network?.name}</span>
                        </StyledP>
                      </StyledTd>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </Collapse.Panel>
            <Collapse.Panel header={"CPU Models"}>
              <StyledTable>
                <tbody>
                  {data?.cpu_models.map((item, index) => (
                    <tr key={index}>
                      <StyledTd>
                        <StyledP>
                          <span>{item?.name}</span>
                        </StyledP>
                      </StyledTd>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </Collapse.Panel>

            <Collapse.Panel header={"Physical Network Adapters"}>
              <StyledTable>
                <tbody>
                  <tr>
                    <StyledTd>
                      <StyledP>Device</StyledP>
                    </StyledTd>
                    <StyledTd>
                      <StyledP>Driver</StyledP>
                    </StyledTd>
                    <StyledTd>
                      <StyledP>Mac</StyledP>
                    </StyledTd>
                  </tr>
                  {data?.physical_network_adapters.map((adapter) => (
                    <>
                      <tr>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.device}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.driver}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.mac}</span>
                          </StyledP>
                        </StyledTd>
                      </tr>
                    </>
                  ))}
                </tbody>
              </StyledTable>
            </Collapse.Panel>
            <Collapse.Panel header={"Data Stores"}>
              <StyledTable style={{ width: "100%", color: "white" }}>
                <tbody>
                  <tr>
                    <StyledTd>
                      <StyledP>Name</StyledP>
                    </StyledTd>
                    <StyledTd>
                      <StyledP>Capacity</StyledP>
                    </StyledTd>
                    <StyledTd>
                      <StyledP>Type</StyledP>
                    </StyledTd>
                    <StyledTd>
                      <StyledP>Free Space</StyledP>
                    </StyledTd>
                  </tr>
                  {data?.datastores.map((adapter) => (
                    <>
                      <tr>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.name}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.capacity}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.type}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.free_space}</span>
                          </StyledP>
                        </StyledTd>
                      </tr>
                    </>
                  ))}
                </tbody>
              </StyledTable>
            </Collapse.Panel>
            <Collapse.Panel header={"Storage"}>
              <StyledTable style={{ width: "100%", color: "white" }}>
                <tbody>
                  {data?.storage_adapters.map((adapter) => (
                    <>
                      <tr>
                        <StyledTd>
                          <StyledP>Driver</StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>Model</StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>Storage Key</StyledP>
                        </StyledTd>
                      </tr>
                      <tr>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.driver}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.model}</span>
                          </StyledP>
                        </StyledTd>
                        <StyledTd>
                          <StyledP>
                            <span>{adapter?.storage_key}</span>
                          </StyledP>
                        </StyledTd>
                      </tr>
                    </>
                  ))}
                </tbody>
              </StyledTable>
            </Collapse.Panel>
          </StyledCollapse>
        </>
      ) : hardware == "true" ? (
        <>
          {/* <Collapse accordion className="custom-collapse">
            <Collapse.Panel header={"CPU"}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr
                    style={{
                      borderBottom: "1px solid #36424E",
                    }}
                  >
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 00px 0px",
                        }}
                      >
                        No of CPUs
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.num_cpus} CPUs</span>
                      </p>
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderBottom: "1px solid #36424E",
                    }}
                  >
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        Processor
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.processor_type}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        Memory
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.total_memory_GB}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>
            <Collapse.Panel header={"Hard disk"}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        {data?.hard_disks[0].name}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.hard_disks[0].size_MB}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>

            <Collapse.Panel header={"USB Controller"}>
              <table style={{ width: "100%" }}>
                <tbody style={{ margin: "0px" }}>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                        margin: "0px",
                        padding: "0px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>

            <Collapse.Panel header={"Other Hardwares"}>
              <div
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  overflowX: "none",
                  width: "100%",
                }}
              >
                <table style={{ width: "100%" }}>
                  <tbody>
                    {data?.other_hardware.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <p
                            style={{
                              borderBottom: "1px solid #36424E",
                              padding: "10px",
                              margin: "0px 0px 0px 0px",
                              width: "100%",
                            }}
                          >
                            {item.hardware_name}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapse.Panel>
          </Collapse> */}
        </>
      ) : host !== "true" ? (
        <>
          {/* <Collapse accordion className="custom-collapse">
            <Collapse.Panel header={"Networking"}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr
                    style={{
                      borderBottom: "1px solid #36424E",
                    }}
                  >
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        Host Name
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.hostname}</span>
                      </p>
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderBottom: "1px solid #36424E",
                    }}
                  >
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        IP Address
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.ip_address}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>
            <Collapse.Panel header={"VMware Tools"}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        VMWare Tools
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.vmware_tools}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>

            <Collapse.Panel header={"Storage"}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        Number of disks
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          borderBottom: "1px solid #36424E",
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.num_disks}</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #36424E",
                        width: "150px",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",
                        }}
                      >
                        Total Disk GB
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          padding: "10px",
                          margin: "0px 0px 0px 0px",

                          width: "100%",
                        }}
                      >
                        <span>{data?.total_disk_GB}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Collapse.Panel>
          </Collapse> */}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CustomAccordion;
