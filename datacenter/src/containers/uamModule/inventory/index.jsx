import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import SeedFormModal from "./modal";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/inventory/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/inventory/selectors";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
} from "../../../components/sweetAlertWrapper";
import {
  jsonToExcel,
  columnGenerator,
  generateObject,
} from "../../../utils/helpers";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";
import { Spin, Button } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";
import { Modal, Input, Form } from "antd";
import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { baseUrl } from "../../../utils/axios";
import axios from "axios";
import SeedDetails from "./seedDetails";
const Index = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // refs

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [access_token, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventoryPageData, setInventoryPageData] = useState([]);
  const [seedDetail, setSeedDetail] = useState();

  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  const { confirm } = Modal;

  const fetchSeeds = async () => {
    const access_token = localStorage.getItem("access_token");

    setLoading(true);
    console.log(access_token, "fabric token");
    try {
      const response = await axios.get(
        baseUrl + "/apic/getallfabricnodes",
        // {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response) {
        setInventoryPageData(response.data.data);
        console.log(response, "seeds resp");
        // setRacksData(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    fetchSeeds();
  }, []);

  const onFinish = (values) => {
    if (values.ips) {
      values.ips.push(values.ip);
      delete values["ip"];
      setOpen2(false);
      console.log("Received values of form:", values);
    } else {
      console.log("Received values of form:", values);
    }
  };

  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  const [
    deleteRecords,
    {
      data: deleteRecordsData,
      isSuccess: isDeleteRecordsSuccess,
      isLoading: isDeleteRecordsLoading,
      isError: isDeleteRecordsError,
      error: deleteRecordsError,
    },
  ] = useDeleteRecordsMutation();

  // error handling custom hooks
  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: "fetch",
  });

  useErrorHandling({
    data: deleteRecordsData,
    isSuccess: isDeleteRecordsSuccess,
    isError: isDeleteRecordsError,
    error: deleteRecordsError,
    type: "bulk",
  });

  // const handleOk = () => {
  //   setOpen(false);
  // };
  const handleDelete = (id) => {
    console.log(id, "id");
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    // console.log("Various parameters", pagination, filters, sorter, extra);
  };

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showConfirm = async (id) => {
    confirm({
      title: (
        <span style={{ color: "gray" }}>Are you sure you want to delete?</span>
      ),
      icon: <ExclamationCircleFilled />,
      content: (
        <span style={{ color: "gray" }}>
          Once you delete it will permanatly remove from the database. Are you
          sure you want to proceed?
        </span>
      ),
      okText: "yes",
      okType: "primary",
      okButtonProps: {
        // disabled: true,
      },
      cancelText: "No",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const viewDetails = (record) => {
    setSeedDetail(record);
    setOpen3(true);
  };
  const columns = [
    {
      title: "Device Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),

      onCell: (record) => ({
        onClick: () => {
          navigate(`inventorydetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },
    {
      title: "Device IP",
      dataIndex: "apic_controller_ip",
      key: "apic_controller_ip",
      sorter: (a, b) =>
        a.apic_controller_ip.localeCompare(b.apic_controller_ip),

      ...getColumnSearchProps("apic_controller_ip"),
    },
    {
      title: "Device Serial Number",
      dataIndex: "serial",
      key: "serial",
      ...getColumnSearchProps("serial"),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      ...getColumnSearchProps("model"),
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      ...getColumnSearchProps("vendor"),
    },
    // {
    //   title: "Role",
    //   dataIndex: "role",
    //   key: "role",
    //   sorter: (a, b) => a.role.localeCompare(b.role),
    //   ...getColumnSearchProps("role"),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   ...getColumnSearchProps("status"),
    // },
    // {
    //   title: "AD Status",
    //   dataIndex: "adStatus",
    //   key: "adStatus",
    //   sorter: (a, b) => a.adStatus.localeCompare(b.adStatus),
    //   ...getColumnSearchProps("adStatus"),
    // },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      ...getColumnSearchProps("address"),
    },

    // {
    //   title: "Pod",
    //   dataIndex: "pod",
    //   key: "pod",
    //   ...getColumnSearchProps("pod"),
    // },
    {
      title: "Node",
      dataIndex: "node",
      key: "node",
      ...getColumnSearchProps("node"),
    },
    {
      title: "Mod ts",
      dataIndex: "mod_ts",
      key: "mod_ts",
      ...getColumnSearchProps("mod_ts"),
    },
    {
      title: "Modified Date",
      dataIndex: "last_state_mod_ts",
      key: "last_state_mod_ts",
      ...getColumnSearchProps("last_state_mod_ts"),
    },
    {
      title: "RU",
      dataIndex: "RU",
      key: "RU",
      ...getColumnSearchProps("RU"),
      render: (text, record) => (
        <span>{record.RU === 42 ? record.RU - 1 : record.RU}</span>
      ),
    },
    // {
    //   title: "Site",
    //   dataIndex: "site",
    //   key: "site",
    //   ...getColumnSearchProps("site"),
    // },
    // {
    //   title: "Rack",
    //   dataIndex: "rack",
    //   key: "rack",
    // },

    {
      title: "PN Code",
      dataIndex: "pnCode",
      key: "pnCode",
      ...getColumnSearchProps("pnCode"),
    },
    {
      title: "Hardware Version",
      dataIndex: "hardwareVersion",
      key: "hardwareVersion",
    },
    {
      title: "Software Version",
      dataIndex: "version",
      key: "version",
      ...getColumnSearchProps("version"),
    },
    {
      title: "Delayed Heartbeat",
      dataIndex: "delayed_heartbeat",
      key: "delayed_heartbeat",
      ...getColumnSearchProps("delayed_heartbeat"),
    },
    {
      title: "fabric Status",
      dataIndex: "fabric_status",
      key: "fabric_status",
      ...getColumnSearchProps("fabric_status"),
    },
    {
      title: "End of HW Life",
      dataIndex: "endOfHWLife",
      key: "endOfHWLife",
    },
    {
      title: "End of HW Sale",
      dataIndex: "endOfHWSale",
      key: "endOfHWSale",
    },
    {
      title: "End of SW Life",
      dataIndex: "endOfSWLife",
      key: "endOfSWLife",
    },
    {
      title: "End of SW Sale",
      dataIndex: "endOfSWSale",
      key: "endOfSWSale",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "Onboarding Date",
      dataIndex: "onboardingDate",
      key: "onboardingDate",
    },

    // {
    //   title: "Modified By",
    //   dataIndex: "modifiedBy",
    //   key: "modifiedBy",
    // },
    // {
    //   title: "Power Utilization",
    //   dataIndex: "powerUtilization",
    //   key: "powerUtilization",
    // },
    // {
    //   title: "Total Traffic Throughput",
    //   dataIndex: "totalTrafficThroughput",
    //   key: "totalTrafficThroughput",
    // },
    // {
    //   title: "CO2 Footprints",
    //   dataIndex: "co2Footprints",
    //   key: "co2Footprints",
    // },
  ];

  columns.push({
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: 100,
    render: (text, record) => (
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "17px" }}
        />
        <Icon
          fontSize={"16px"}
          onClick={() => handleEdit(record)}
          icon="bx:edit"
        />
        <Icon
          onClick={() => showConfirm(record.id)}
          fontSize={"14px"}
          icon="uiw:delete"
        />
      </div>
    ),
  });

  return (
    <div>
      {open ? (
        <SeedFormModal
          handleClose={handleClose}
          open={open}
          recordToEdit={recordToEdit}
        />
      ) : null}

      <Modal
        open={open2}
        title={<h3 style={{ color: "white", marginTop: "0px" }}>Fill form</h3>}
        // onOk={handleOk}
        onCancel={() => setOpen2(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <Button>Custom Button</Button> */}
            <CancelBtn />
            {/* <OkBtn /> */}
          </>
        )}
        closeIcon={<CustomCloseIcon />}
      >
        <Form name="dynamic_form_item" onFinish={onFinish}>
          <Form.Item
            name="user"
            rules={[
              {
                required: true,
                message: "Please input your user!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="User"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password",
              },
            ]}
          >
            <Input
              // prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Password"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <div style={{ position: "relative" }}>
            <Form.Item
              style={{ Bottom: "30px" }}
              name="ip"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input ip address or delete this field.",
                },
              ]}
              noStyle
            >
              <Input
                placeholder="ip address"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.List name="ips">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      // label={index === 0 ? "IP" : ""}
                      required={false}
                      key={field.key}
                      className="custom-label-color"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          width: "100%",
                          marginTop: index === 0 ? "25px" : "",
                        }}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input ip address or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="ip address"
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                        {fields.length > 0 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}

                  <Button
                    type="solid"
                    onClick={() => add()}
                    style={{
                      width: "40px",
                      position: "absolute",
                      top: -0.3,
                      right: 0,
                      border: "1px solid #0490e7",
                      borderRadius: "0px 6px 6px 0px",
                    }}
                    icon={<PlusOutlined />}
                  ></Button>
                </>
              )}
            </Form.List>
          </div>
          <Form.Item style={{ marginTop: "30px" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width="100%"
        open={open3}
        title={
          <h3 style={{ color: "white", marginTop: "0px" }}>Seed Details</h3>
        }
        // onOk={handleOk}
        onCancel={() => setOpen3(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button
              style={{
                backgroundColor: "#0490E7",
                borderColor: "#0490E7",
                color: "white",
              }}
              onClick={() => setOpen3(false)}
            >
              Cancel
            </Button>
            {/* <CancelBtn /> */}
            {/* <OkBtn /> */}
          </>
        )}
        closeIcon={<CustomCloseIcon />}
        style={{
          top: 20,
        }}
      >
        <SeedDetails data={seedDetail} />
      </Modal>

      <div
        style={{
          width: "97.5%",
          // padding: "0 40px 0 10px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "#050C17",
            padding: "12px 0px 14px 15px",
            marginTop: "10px",
            width: "96.5%",
            margin: "0 auto",
          }}
        >
          <span>Resultes</span>
          <span
            style={{
              width: "27px",
              height: "27px",
              borderRadius: "100%",
              background: "#0490E7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
            }}
          >
            {inventoryPageData?.length}
          </span>
        </div>
        <Button
          style={{
            background: "#0490E7",
            height: "33px",
            color: "white",
            textTransform: "capitalize",
            // display: "flex",
            // alignItems: "center",
            // gap: "5px",
            borderRadius: "4px",
            borderColor: "#0490E7",
            marginRight: "10px",
          }}
          onClick={() => setOpen2(true)}
        >
          On Board
        </Button>
      </div>

      <DefaultCard sx={{ width: `${width - 105}px` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              background: "#0490E7",
              height: "33px",
              color: "white",
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              borderRadius: "2px",
              borderColor: "#0490E7",
            }}
          >
            <Icon icon="uil:setting" />
            Configure Table
          </Button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "10px 0 10px 0",
            }}
          >
            <Button
              style={{
                background: "#7A2731",
                height: "33px",
                color: "white",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "4px",
                borderColor: "#7A2731",
              }}
              onClick={() => showConfirm()}
            >
              {/* <Icon icon="uil:setting" /> */}
              <Icon fontSize="16px" icon="mingcute:delete-line" />
              Delete
            </Button>
            <Button
              style={{
                background: "#0490E7",
                height: "33px",
                color: "white",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "4px",
                borderColor: "#0490E7",
              }}
              onClick={() => setOpen(true)}
            >
              {/* <Icon icon="uil:setting" /> */}
              <Icon icon="lucide:plus" />
              Add Seed
            </Button>
          </div>
        </div>
        <Spin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={inventoryPageData}
            rowKey="name"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, inventoryPageData.length],
            }}
            // onRow={rowProps}
            scroll={{
              x: 5500,
            }}
          />
        </Spin>
      </DefaultCard>
    </div>
  );
};

export default Index;
const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);
