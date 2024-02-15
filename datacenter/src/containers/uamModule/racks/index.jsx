import React, { useState, useEffect } from "react";
import { baseUrl } from "../../../utils/axios";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import CustomModalRacks from "./modal";

import { useNavigate } from "react-router-dom";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/racks/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/racks/selectors";
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
import { Spin, Button, Modal } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";
import ViewRackDetail from "./viewRackDetail";
import axios from "axios";

import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

const Index = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [racksData, setRacksData] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [rackDetail, setRackDetail] = useState();
  const [access_token, setAccessToken] = useState("");

  // selectors
  const dataSource = useSelector(selectTableData);
  const { confirm } = Modal;

  const fetchRacks = async () => {
    setLoading(true);
    const access_token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        baseUrl + "/racks/getallracks",
        // {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response) {
        setRacksData(response.data.data);
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

    fetchRacks();
  }, []);

  // apis

  const handleDelete = async (id) => {
    try {
      if (selectedRowKeys.length > 0) {
        console.log(access_token, "tokennnnn in if");

        const response = await axios.post(
          baseUrl + `/racks/deleteracks`,
          { rack_ids: ids },
          // {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status == "200") {
          Swal.fire({
            title: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
            timerProgressBar: true,
            onClose: () => {
              console.log("Popup closed");
            },
          });
          setSelectedRowKeys([]);
        }
      } else {
        const response = await axios.post(
          baseUrl + `/racks/deleterack/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (response.status == "200") {
          Swal.fire({
            title: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
            timerProgressBar: true,
            onClose: () => {
              console.log("Popup closed");
            },
          });
        }
      }
      fetchRacks();
      // console.log(response, "sites response");
    } catch (err) {
      console.log(err);
      setSelectedRowKeys([]);
    }
    // if (selectedRowKeys.length > 0) {
    //   handleCallbackAlert(
    //     "Are you sure you want to delete these records?",
    //     deleteData
    //   );
    // } else {
    //   handleInfoAlert("No record has been selected to delete!");
    // }
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
    console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, "record data");
      setIds((prevRackId) => [...prevRackId, record.id]);
    },
    onSelectAll: (record, selected, selectedRows) => {},
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
    setRackDetail(record);
    setOpen3(true);
  };

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Rack Name",
      dataIndex: "rack_name",
      key: "rack_name",
      ...getColumnSearchProps("rack_name"),
      onCell: (record) => ({
        onClick: () => {
          navigate(`rackdetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },

    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      ...getColumnSearchProps("site_name"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (record) => {
        // console.log(record, "sites record");
        return (
          <>
            {record == "Active" ? (
              <div
                style={{
                  color: "#C8FF8C",
                }}
              >
                {record}
              </div>
            ) : record == "In Active" ? (
              <div
                style={{
                  color: "#D21E16",
                }}
              >
                {record}
              </div>
            ) : (
              <div
                style={{
                  color: "#B28922",
                }}
              >
                {record}
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Total Devices",
      dataIndex: "total_devices",
      key: "total_devices",
      ...getColumnSearchProps("total_devices"),
    },
    // {
    //   title: "Unit Position",
    //   dataIndex: "unit_position",
    //   key: "unit_position",
    //   ...getColumnSearchProps("unit_position"),
    // },
    // {
    //   title: "Manufacture Name",
    //   dataIndex: "manufacture_name",
    //   key: "manufacture_name",
    //   ...getColumnSearchProps("manufacture_name"),
    // },
    // {
    //   title: "PN Code",
    //   dataIndex: "pn_code",
    //   key: "pn_code",
    //   ...getColumnSearchProps("pn_code"),
    // },
    // {
    //   title: "Rack Model",
    //   dataIndex: "rack_model",
    //   key: "rack_model",
    //   ...getColumnSearchProps("rack_model"),
    // },
    // {
    //   title: "Tag ID",
    //   dataIndex: "Tag_id",
    //   key: "Tag_id",
    //   ...getColumnSearchProps("Tag_id"),
    // },
    {
      title: "RU",
      dataIndex: "Ru",
      key: "Ru",
      ...getColumnSearchProps("Ru"),
    },
    {
      title: "Floor",
      dataIndex: "floor",
      key: "floor",
      ...getColumnSearchProps("floor"),
    },
    {
      title: "Height",
      dataIndex: "Height",
      key: "Height",
      ...getColumnSearchProps("Height"),
    },
    {
      title: "Depth",
      dataIndex: "Depth",
      key: "Depth",
      ...getColumnSearchProps("Depth"),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      ...getColumnSearchProps("serial_number"),
    },

    {
      title: "Power Utilization",
      dataIndex: "power_utilization",
      key: "power_utilization",
      ...getColumnSearchProps("power_utilization"),
    },
    {
      title: "Traffic Throughput",
      dataIndex: "traffic_throughput",
      key: "traffic_throughput",
      ...getColumnSearchProps("traffic_throughput"),
    },
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
          alignItems: "center",
          gap: "10px",
        }}
      >
        <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "16px" }}
        />
        <Icon
          style={{ fontSize: "16px" }}
          onClick={() => handleEdit(record)}
          icon="bx:edit"
        />
        <DeleteOutlined
          style={{ fontSize: "16px" }}
          onClick={() => showConfirm(record.id)}
        />
      </div>
    ),
  });

  const modifiedRacks = racksData.map((data) => {
    return {
      ...data,
      site_name: "SULAY",
      power_utilization: "79%",
      traffic_throughput: "89%",
    };
  });

  return (
    <div>
      <CustomModalRacks
        handleClose={handleClose}
        open={open}
        recordToEdit={recordToEdit}
        fetchRacks={fetchRacks}
      />
      <Modal
        width="80%"
        open={open3}
        title={
          <h3 style={{ color: "white", marginTop: "0px" }}>Rack Details</h3>
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
        <ViewRackDetail data={rackDetail} />
      </Modal>

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
            width: "16px",
            height: "16px",
            borderRadius: "100%",
            background: "#0490E7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
          }}
        >
          {racksData?.length}
        </span>
      </div>
      <DefaultCard>
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
            {/* <PageHeader pageName="" buttons={buttons} setOpen={setOpen} /> */}
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
              Add Rack
            </Button>
          </div>
        </div>
        <Spin spinning={loading === true ? { loading } : null}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={modifiedRacks}
            rowKey="id"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, 100, 500, 1000],
            }}
            scroll={{
              x: 2000,
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
