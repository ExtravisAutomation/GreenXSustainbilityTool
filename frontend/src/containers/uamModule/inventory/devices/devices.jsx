// import React, { useState, useEffect } from "react";
// import { useTheme } from "@mui/material/styles";
// import DefaultCard from "../../../../components/cards.jsx";
// import { Icon } from "@iconify/react";
// import DefaultTable from "../../../../components/tables.jsx";
// import { getTitle } from "../../../../utils/helpers/index.js";
// import ExportButton from "../../../../components/exportButton.jsx";
// import { useNavigate } from "react-router-dom";
// import SeedFormModal from "../modal.jsx";
// import {
//   useFetchRecordsQuery,
//   useDeleteRecordsMutation,
// } from "../../../../store/features/uamModule/inventory/apis.js";
// import { useSelector } from "react-redux";
// import { selectTableData } from "../../../../store/features/uamModule/inventory/selectors.js";
// import useWindowDimensions from "../../../../hooks/useWindowDimensions.js";
// import {
//   handleSuccessAlert,
//   handleInfoAlert,
//   handleCallbackAlert,
// } from "../../../../components/sweetAlertWrapper.jsx";
// import {
//   jsonToExcel,
//   columnGenerator,
//   generateObject,
// } from "../../../../utils/helpers/index.js";
// import useColumnSearchProps from "../../../../hooks/useColumnSearchProps.js";
// import { Spin, Button } from "antd";
// import useErrorHandling from "../../../../hooks/useErrorHandling.js";
// import { dataKeysArray } from "../constants.js";
// import PageHeader from "../../../../components/pageHeader.jsx";
// import { Modal, Input, Form, message, Tooltip } from "antd";
// import { Outlet } from "react-router-dom";
// import {
//   ExclamationCircleFilled,
//   RightOutlined,
//   CloseOutlined,
//   DeleteOutlined,
//   EyeOutlined,
//   UserOutlined,
//   MinusCircleOutlined,
//   PlusOutlined,
//   CloseCircleOutlined,
// } from "@ant-design/icons";
// import Swal from "sweetalert2";
// import { BaseUrl, baseUrl } from "../../../../utils/axios/index.js";
// import axios from "axios";
// import SeedDetails from "../seedDetails.jsx";
// import CustomProgress from "../../../../components/customProgress.jsx";
// import CustomPagination from "../../../../components/customPagination.jsx";
// import HorizontalMenu from "../../../../components/horizontalMenu.jsx";
// const conicColors = {
//   "0%": "#3CB371", // Medium Sea Green, a brighter but not too bright green
//   "50%": "#2b548f", // Medium Slate Blue, a brighter and lively blue
//   "100%": "#c4101e", // Tomato, a vibrant yet not too harsh red
// };
// const Devices = () => {
//   // theme
//   const theme = useTheme();
//   const navigate = useNavigate();

//   // hooks
//   const { height, width } = useWindowDimensions();
//   const getColumnSearchProps = useColumnSearchProps();

//   // refs

//   // states
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [dataKeys, setDataKeys] = useState(dataKeysArray);
//   const [recordToEdit, setRecordToEdit] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [open2, setOpen2] = useState(false);
//   const [open3, setOpen3] = useState(false);
//   const [access_token, setAccessToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [inventoryPageData, setInventoryPageData] = useState([]);
//   const [seedDetail, setSeedDetail] = useState();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [filteredData, setFilteredData] = useState([]);

//   axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

//   const { confirm } = Modal;
//   const color = "#36424e";
//   const fetchSeeds = async () => {
//     const access_token = localStorage.getItem("access_token");

//     setLoading(true);
//     try {
//       const response = await axios.get(
//         BaseUrl + "/device_inventory/get_all_device_inventory"
//       );
//       if (response) {
//         setInventoryPageData(response?.data?.data);
//         setLoading(false);
//       }
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const access_token = localStorage.getItem("access_token");
//     setAccessToken(access_token);
//     fetchSeeds();
//   }, []);

//   const onFinish = async (values) => {
//     if (values.ips) {
//       values.ips.push(values.ip);
//       delete values["ip"];
//       setOpen2(false);
//     } else {
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await axios.post(BaseUrl + "/device_inventory/deletesite", [
//         id,
//       ]);
//     } catch (error) {}
//   };

//   const handleEdit = (record) => {
//     setRecordToEdit(record);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setRecordToEdit(null);
//     setOpen(false);
//   };

//   const handleChange = (pagination, filters, sorter, extra) => {
//     setFilteredData(extra.currentDataSource);
//   };

//   const showConfirm = async (id) => {
//     confirm({
//       title: (
//         <span style={{ color: "gray" }}>Are you sure you want to delete?</span>
//       ),
//       icon: <ExclamationCircleFilled />,
//       content: (
//         <span style={{ color: "gray" }}>
//           Once you delete it will permanatly remove from the database. Are you
//           sure you want to proceed?
//         </span>
//       ),
//       okText: "yes",
//       okType: "primary",
//       okButtonProps: {
//         // disabled: true,
//       },
//       cancelText: "No",
//       onOk() {
//         handleDelete(id);
//       },
//       onCancel() {},
//     });
//   };
//   function formatDateTime(dateTimeStr) {
//     const date = new Date(dateTimeStr);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   }

//   const viewDetails = (record) => {
//     setSeedDetail(record);
//     setOpen3(true);
//   };

//   const onBoard = async () => {
//     try {
//       const res = await axios.post(BaseUrl + "/device_inventory/onboarding");
//       if (res) {
//         messageApi.open({
//           type: "success",
//           content: res.data.message,
//         });
//         fetchSeeds();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const columns = [
//     {
//       title: "Device Name",
//       dataIndex: "device_name",
//       key: "device_name",
//       sorter: (a, b) => a.device_name?.localeCompare(b.device_name),
//       ...getColumnSearchProps("device_name"),

//       onCell: (record) => ({
//         onClick: () => {
//           navigate("inventorydetail", {
//             state: {
//               data: record,
//             },
//           });
//         },
//       }),
//     },
//     {
//       title: "Device IP",
//       dataIndex: "device_ip",
//       key: "device_ip",
//       sorter: (a, b) => a.device_ip?.localeCompare(b.device_ip),

//       ...getColumnSearchProps("device_ip"),
//     },
//     {
//       title: "Serial Number",
//       dataIndex: "serial_number",
//       key: "serial_number",
//       sorter: (a, b) => a.serial_number?.localeCompare(b.serial_number),

//       ...getColumnSearchProps("serial_number"),
//     },
//     {
//       title: "Site Name",
//       dataIndex: "site_name",
//       key: "site_name",
//       sorter: (a, b) => a.site_name?.localeCompare(b.site_name),
//       ...getColumnSearchProps("site_name"),
//     },
//     {
//       title: "Rack Name",
//       dataIndex: "rack_name",
//       key: "rack_name",
//       sorter: (a, b) => a.rack_name?.localeCompare(b.rack_name),
//       ...getColumnSearchProps("rack_name"),
//     },
//     {
//       title: "Department",
//       dataIndex: "department",
//       key: "department",
//       sorter: (a, b) => a.department?.localeCompare(b.department),
//       ...getColumnSearchProps("department"),
//     },

//     {
//       title: "Model Number",
//       dataIndex: "pn_code",
//       key: "pn_code",
//       sorter: (a, b) => a.pnCode?.localeCompare(b.pnCode),

//       ...getColumnSearchProps("pnCode"),
//     },
//     {
//       title: "Criticality",
//       dataIndex: "criticality",
//       key: "criticality",
//       sorter: (a, b) => a.criticality?.localeCompare(b.criticality),

//       ...getColumnSearchProps("criticality"),
//     },

//     {
//       title: "Hardware Version",
//       dataIndex: "hardware_version",
//       key: "hardware_version",
//       sorter: (a, b) => a.hardware_version?.localeCompare(b.hardware_version),

//       ...getColumnSearchProps("hardware_version"),
//     },
//     {
//       title: "Software Version",
//       dataIndex: "software_version",
//       key: "software_version",
//       sorter: (a, b) => a.software_version?.localeCompare(b.software_version),

//       ...getColumnSearchProps("software_version"),
//     },

//     {
//       title: "End of Life External Announcement",
//       dataIndex: "hw_eol_ad",
//       key: "hw_eol_ad",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.hw_eol_ad?.localeCompare(b.hw_eol_ad),

//       ...getColumnSearchProps("hw_eol_ad"),
//     },
//     {
//       title: "End of Sale",
//       dataIndex: "hw_eos",
//       key: "hw_eos",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.hw_eos?.localeCompare(b.hw_eos),

//       ...getColumnSearchProps("hw_eos"),
//     },
//     {
//       title: "End of Software Maintenance Release",
//       dataIndex: "sw_EoSWM",
//       key: "sw_EoSWM",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.sw_EoSWM?.localeCompare(b.sw_EoSWM),

//       ...getColumnSearchProps("sw_EoSWM"),
//     },
//     {
//       title: "End of Routine Failure Analysis",
//       dataIndex: "hw_EoRFA",
//       key: "hw_EoRFA",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.hw_EoRFA?.localeCompare(b.hw_EoRFA),

//       ...getColumnSearchProps("hw_EoRFA"),
//     },
//     {
//       title: "End of Vulnerability/Security Support",
//       dataIndex: "sw_EoVSS",
//       key: "sw_EoVSS",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.sw_EoVSS?.localeCompare(b.sw_EoVSS),

//       ...getColumnSearchProps("sw_EoVSS"),
//     },
//     {
//       title: "End of Service Contract Renewal",
//       dataIndex: "hw_EoSCR",
//       key: "hw_EoSCR",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.hw_EoSCR?.localeCompare(b.hw_EoSCR),

//       ...getColumnSearchProps("hw_EoSCR"),
//     },
//     {
//       title: "Last Date of Support",
//       dataIndex: "hw_ldos",
//       key: "hw_ldos",
//       //   render: (text) => formatDateTime(text),
//       sorter: (a, b) => a.hw_ldos?.localeCompare(b.hw_ldos),

//       ...getColumnSearchProps("hw_ldos"),
//     },
//     {
//       title: "Manufacturer",
//       dataIndex: "manufacturer",
//       key: "manufacturer",
//       sorter: (a, b) => a.manufacturer?.localeCompare(b.manufacturer),

//       ...getColumnSearchProps("manufacturer"),
//     },
//     // {
//     //   title: "Onboarding Date",
//     //   dataIndex: "creation_date",
//     //   key: "creation_date",
//     // },
//     {
//       title: "Section",
//       dataIndex: "section",
//       key: "section",
//       sorter: (a, b) => a.section?.localeCompare(b.section),

//       ...getColumnSearchProps("section"),
//     },

//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       sorter: (a, b) => a.status?.localeCompare(b.status),

//       ...getColumnSearchProps("status"),

//       render: (record) => {
//         return (
//           <div>
//             {record == "Active" ? (
//               <div
//                 style={{
//                   background: "#71B62633",
//                   width: "59px",
//                   textAlign: "center",
//                   height: "18px",
//                   borderRadius: "24px",
//                   color: "#C8FF8C",
//                 }}
//               >
//                 {record}
//               </div>
//             ) : record == "In Active" ? (
//               <div
//                 style={{
//                   background: "#d87053",
//                   width: "59px",
//                   textAlign: "center",
//                   height: "18px",
//                   borderRadius: "24px",
//                   color: "white",
//                 }}
//               >
//                 {record}
//               </div>
//             ) : (
//               <div
//                 style={{
//                   background: "#71B62633",
//                   color: "#C8FF8C",
//                   width: "85px",
//                   textAlign: "center",
//                   height: "18px",
//                   borderRadius: "24px",
//                 }}
//               >
//                 {record}
//               </div>
//             )}
//           </div>
//         );
//       },
//     },

//     {
//       title: "Energy Efficiency",
//       dataIndex: "power_utilization",
//       key: "power_utilization",
//       sorter: (a, b) => {
//         const powerUtilizationA = String(a.power_utilization);
//         const powerUtilizationB = String(b.power_utilization);
//         return powerUtilizationA.localeCompare(powerUtilizationB);
//       },

//       ...getColumnSearchProps("power_utilization"),
//       render: (record) => (
//         <Tooltip
//           placement="left"
//           color={color}
//           key={color}
//           title={
//             record <= 50
//               ? "Low EER values indicate poor efficiency."
//               : record >= 85
//               ? "High EER values signify excellent efficiency."
//               : record < 85 || record > 50
//               ? "Average EER values suggest moderate efficiency."
//               : ""
//           }
//         >
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <CustomProgress
//               percent={record}
//               // type="circle"
//               // strokeWidth="10"
//               size={["90%", 12]}
//               // size={[30]}
//               conicColors={
//                 record < 50
//                   ? "#d91c07"
//                   : record > 50 && record < 85
//                   ? "#0490E7"
//                   : "green"
//               }
//               table="true"
//             />
//           </div>
//         </Tooltip>
//       ),
//     },
//     {
//       title: "Power Utilization Efficiency",
//       dataIndex: "pue",
//       key: "pue",
//       sorter: (a, b) => {
//         const pueA = String(a.pue);
//         const pueB = String(b.pue);
//         return pueA.localeCompare(pueB);
//       },
//       ...getColumnSearchProps("power_input"),
//       render: (record) => (
//         <Tooltip
//           placement="left"
//           color={color}
//           key={color}
//           title={
//             record <= 50
//               ? "Lower PUE indicates better power utilization."
//               : record >= 85
//               ? "Higher PUE indicates worst power utilization."
//               : record < 85 || record > 50
//               ? "Average PUE indicates moderate power utilization."
//               : ""
//           }
//         >
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <CustomProgress
//               percent={record}
//               // type="circle"
//               // strokeWidth="10"
//               size={["90%", 12]}
//               // size={[30]}
//               conicColors={
//                 record > 50
//                   ? "#d91c07"
//                   : record > 50 && record < 85
//                   ? "#0490E7"
//                   : "green"
//               }
//               table="true"
//             />
//           </div>
//         </Tooltip>
//       ),
//       onCell: (record) => ({
//         onClick: () => {
//           navigate(`sitedetail`, {
//             state: {
//               data: record,
//             },
//           });
//         },
//       }),
//     },
//     {
//       title: "Input Power",
//       dataIndex: "power_input",
//       key: "power_input",
//       sorter: (a, b) => a.power_utilization?.localeCompare(b.power_utilization),

//       ...getColumnSearchProps("power_input"),
//       render: (record) => <p>{record} W</p>,
//     },
//     {
//       title: "Traffic Throughput",
//       dataIndex: "datatraffic",
//       key: "datatraffic",
//       sorter: (a, b) => a.datatraffic?.localeCompare(b.datatraffic),

//       ...getColumnSearchProps("datatraffic"),
//       render: (record) => <p>{record} Gb/s</p>,
//     },
//   ];

//   // columns.push({
//   //   title: "Actions",
//   //   dataIndex: "actions",
//   //   key: "actions",
//   //   fixed: "right",
//   //   width: 100,
//   //   render: (text, record) => (
//   //     <div
//   //       style={{
//   //         display: "flex",
//   //         gap: "10px",
//   //         justifyContent: "center",
//   //       }}
//   //     >
//   //       {/* <EyeOutlined
//   //         onClick={() => viewDetails(record)}
//   //         style={{ fontSize: "17px" }}
//   //       /> */}
//   //       <Icon
//   //         fontSize={"16px"}
//   //         onClick={() => handleEdit(record)}
//   //         icon="bx:edit"
//   //       />
//   //       <Icon
//   //         onClick={() => showConfirm(record.id)}
//   //         fontSize={"14px"}
//   //         icon="uiw:delete"
//   //       />
//   //     </div>
//   //   ),
//   // });

//   return (
//     <div>
//       {contextHolder}
//       {open ? (
//         <SeedFormModal
//           handleClose={handleClose}
//           open={open}
//           recordToEdit={recordToEdit}
//         />
//       ) : null}

//       <Modal
//         open={open2}
//         title={<h3 style={{ color: "white", marginTop: "0px" }}>Fill form</h3>}
//         // onOk={handleOk}
//         onCancel={() => setOpen2(false)}
//         footer={(_, { OkBtn, CancelBtn }) => (
//           <>
//             {/* <Button>Custom Button</Button> */}
//             <CancelBtn />
//             {/* <OkBtn /> */}
//           </>
//         )}
//         closeIcon={<CustomCloseIcon />}
//       >
//         <Form name="dynamic_form_item" onFinish={onFinish}>
//           <Form.Item
//             name="user"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your user!",
//               },
//             ]}
//           >
//             <Input
//               prefix={<UserOutlined className="site-form-item-icon" />}
//               placeholder="User"
//               style={{
//                 width: "100%",
//               }}
//             />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your password",
//               },
//             ]}
//           >
//             <Input
//               // prefix={<UserOutlined className="site-form-item-icon" />}
//               placeholder="Password"
//               style={{
//                 width: "100%",
//               }}
//             />
//           </Form.Item>
//           <div style={{ position: "relative" }}>
//             <Form.Item
//               style={{ Bottom: "30px" }}
//               name="ip"
//               validateTrigger={["onChange", "onBlur"]}
//               rules={[
//                 {
//                   required: true,
//                   whitespace: true,
//                   message: "Please input ip address or delete this field.",
//                 },
//               ]}
//               noStyle
//             >
//               <Input
//                 placeholder="ip address"
//                 style={{
//                   width: "100%",
//                 }}
//               />
//             </Form.Item>

//             <Form.List name="ips">
//               {(fields, { add, remove }, { errors }) => (
//                 <>
//                   {fields.map((field, index) => (
//                     <Form.Item
//                       // label={index === 0 ? "IP" : ""}
//                       required={false}
//                       key={field.key}
//                       className="custom-label-color"
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "5px",
//                           width: "100%",
//                           marginTop: index === 0 ? "25px" : "",
//                         }}
//                       >
//                         <Form.Item
//                           {...field}
//                           validateTrigger={["onChange", "onBlur"]}
//                           rules={[
//                             {
//                               required: true,
//                               whitespace: true,
//                               message:
//                                 "Please input ip address or delete this field.",
//                             },
//                           ]}
//                           noStyle
//                         >
//                           <Input
//                             placeholder="ip address"
//                             style={{
//                               width: "100%",
//                             }}
//                           />
//                         </Form.Item>
//                         {fields.length > 0 ? (
//                           <MinusCircleOutlined
//                             className="dynamic-delete-button"
//                             onClick={() => remove(field.name)}
//                           />
//                         ) : null}
//                       </div>
//                     </Form.Item>
//                   ))}

//                   <Button
//                     type="solid"
//                     onClick={() => add()}
//                     style={{
//                       width: "40px",
//                       position: "absolute",
//                       top: -0.3,
//                       right: 0,
//                       border: "1px solid #0490e7",
//                       borderRadius: "0px 6px 6px 0px",
//                     }}
//                     icon={<PlusOutlined />}
//                   ></Button>
//                 </>
//               )}
//             </Form.List>
//           </div>
//           <Form.Item style={{ marginTop: "30px" }}>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         width="100%"
//         open={open3}
//         title={
//           <h3 style={{ color: "white", marginTop: "0px" }}>Seed Details</h3>
//         }
//         // onOk={handleOk}
//         onCancel={() => setOpen3(false)}
//         footer={(_, { OkBtn, CancelBtn }) => (
//           <>
//             <Button
//               style={{
//                 backgroundColor: "#0490E7",
//                 borderColor: "#0490E7",
//                 color: "white",
//               }}
//               onClick={() => setOpen3(false)}
//             >
//               Cancel
//             </Button>
//             {/* <CancelBtn /> */}
//             {/* <OkBtn /> */}
//           </>
//         )}
//         closeIcon={<CustomCloseIcon />}
//         style={{
//           top: 20,
//         }}
//       >
//         <SeedDetails data={seedDetail} />
//       </Modal>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div
//           style={{
//             color: "white",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             background: "#050C17",
//             padding: "12px 0px 14px 15px",
//             marginTop: "10px",
//             width: "96.5%",
//             margin: "0 auto",
//           }}
//         >
//           <span>Resultes</span>
//           <span
//             style={{
//               width: "27px",
//               height: "27px",
//               borderRadius: "100%",
//               background: "#0490E7",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               fontSize: "10px",
//             }}
//           >
//             {filteredData.length > 0
//               ? filteredData.length
//               : inventoryPageData
//               ? inventoryPageData?.length
//               : ""}
//           </span>
//         </div>
//       </div>

//       <DefaultCard sx={{ width: `${width - 105}px` }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h3 style={{ color: "white" }}>Device Details</h3>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "7px",
//               width: "40%",
//               marginLeft: "auto",
//               justifyContent: "end",
//             }}
//           >
//             <ExportButton
//               dataSource={
//                 filteredData
//                   ? filteredData
//                   : inventoryPageData
//                   ? inventoryPageData
//                   : []
//               }
//               columns={columns}
//               name="Devices"
//             />

//             <Button
//               style={{
//                 background: "#0490E7",
//                 height: "33px",
//                 color: "white",
//                 textTransform: "capitalize",

//                 borderRadius: "4px",
//                 borderColor: "#0490E7",
//                 marginRight: "10px",
//               }}
//               onClick={() => setOpen(true)}
//             >
//               OnBoard Device
//             </Button>
//           </div>
//         </div>
//         <Spin spinning={loading}>
//           <DefaultTable
//             rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
//             size="small"
//             onChange={handleChange}
//             columns={columns}
//             dataSource={inventoryPageData}
//             rowKey="id"
//             style={{ whiteSpace: "pre" }}
//             pagination={{
//               defaultPageSize: 10,
//               pageSizeOptions: [10, 50, 100, inventoryPageData?.length],
//             }}
//             scroll={{
//               x: 4500,
//             }}
//           />
//         </Spin>
//       </DefaultCard>
//       {/* <Outlet /> */}
//     </div>
//   );
// };

// export default Devices;
// const CustomCloseIcon = () => (
//   <span style={{ color: "red" }}>
//     <Icon fontSize={"25px"} icon="material-symbols:close" />
//   </span>
// );
