import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import CustomModal from "./modal";
import { useNavigate } from "react-router-dom";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/sites/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/sites/selectors";
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
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";
import { Button } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import { ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import ViewSiteDetail from "./viewSiteDetail";

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
  const [open3, setOpen3] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [access_token, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [siteDetail, setSiteDetail] = useState();
  const { confirm } = Modal;

  const fetchSites = async () => {
    setLoading(true);
    const access_token = localStorage.getItem("access_token");

    // console.log(access_token, "access token");

    try {
      const response = await axios.get(
        baseUrl + "/sites/getallsites",
        // {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response) {
        // const modifiedData = response.data.data.map((item, index) => ({
        //   ...item,
        //   key: index, // Assuming you want to add a unique key for each item
        //   // You can add more keys here if needed
        // }));

        setDataSource(response.data.data);
        setLoading(false);
      }

      // console.log(response, "sites response");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);

    fetchSites();
  }, []);
  // selectors
  // const dataSource = useSelector(selectTableData);

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      ...getColumnSearchProps("site_name"),
      onCell: (record) => ({
        onClick: () => {
          navigate(`sitedetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },
    {
      title: "Site Type",
      dataIndex: "site_type",
      key: "site_type",
      ...getColumnSearchProps("site_type"),
    },
    {
      title: "Country",
      dataIndex: "region",
      key: "region",
      ...getColumnSearchProps("region"),
      render: (record) => {
        return (
          <>
            <div
              style={{
                color: "#0490E7",
              }}
            >
              {record}
            </div>
          </>
        );
      },
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...getColumnSearchProps("city"),
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
                  background: "#71B62633",
                  width: "59px",
                  textAlign: "center",
                  height: "18px",
                  borderRadius: "24px",
                  color: "#C8FF8C",
                }}
              >
                {record}
              </div>
            ) : (
              <div
                style={{
                  background: "#d87053",
                  width: "59px",
                  textAlign: "center",
                  height: "18px",
                  borderRadius: "24px",
                  color: "white",
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
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
      ...getColumnSearchProps("latitude"),
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
      ...getColumnSearchProps("longitude"),
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
  // apis
  const {
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isLoading: isFetchRecordsLoading,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
  } = useFetchRecordsQuery();

  useErrorHandling({
    data: fetchRecordsData,
    isSuccess: isFetchRecordsSuccess,
    isError: isFetchRecordsError,
    error: fetchRecordsError,
    type: "fetch",
  });

  const handleDelete = async (id) => {
    console.log(access_token, "tokennnnn");
    try {
      if (selectedRowKeys.length > 0) {
        const response = await axios.post(
          baseUrl + `/sites/deletesites`,
          { site_ids: ids },

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
          baseUrl + `/sites/deletesite?site_id=${id}`,
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
      fetchSites();
      // console.log(response, "sites response");
    } catch (err) {
      console.log(err);
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
    // console.log(record, "edit record");
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleAdd = (optionType) => {
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    // console.log("Various parameters", pagination, filters, sorter, extra);
  };

  const handleExport = (optionType) => {
    if (optionType === "All Devices") {
      jsonToExcel(dataSource, "sites");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "site_template");
    }
    handleSuccessAlert("File exported successfully.");
  };

  // columns
  // let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);
  const showConfirm = async (id) => {
    // console.log("show confirm");
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
    setSiteDetail(record);
    setOpen3(true);
  };
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
          gap: "13px",
          // justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "16px" }}
        />
        <Icon
          fontSize={"16px"}
          onClick={() => handleEdit(record)}
          icon="ri:edit-line"
        />
        <Icon
          onClick={() => showConfirm(record.id)}
          fontSize={"14px"}
          icon="uiw:delete"
        />
      </div>
    ),
  });

  const handleClick = () => {
    setOpen(true);
  };

  // page header buttons
  const buttons = [
    {
      handleClick,
      type: "Add Site",
      icon: <Icon icon="lucide:plus" />,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, "record data");
      setIds((prevSiteId) => [...prevSiteId, record.id]);
    },
    onSelectAll: (record, selected, selectedRows) => {
      // console.log(record.userid, "user id from record");
      // console.log(selected, "selected data");
      // const newFormId = { form_id: record.resp_id };
      // setFormId((prevFormId) => [...prevFormId, newFormId]);
    },
  };

  const modifiedDataSource = dataSource.map((data) => {
    return {
      ...data,
      power_utilization: "79%",
      traffic_throughput: "71%",
    };
  });
  return (
    <div>
      {/* {open ? ( */}
      <CustomModal
        handleClose={handleClose}
        open={open}
        recordToEdit={recordToEdit}
        fetchSites={fetchSites}
      />
      {/* ) : null} */}
      <Modal
        width="80%"
        open={open3}
        title={
          <h3 style={{ color: "white", marginTop: "0px" }}>Site Details</h3>
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
        <ViewSiteDetail data={siteDetail} />
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
          {dataSource?.length}
        </span>
      </div>
      <DefaultCard sx={{ width: `${width - 120}px`, margin: "0 auto" }}>
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
              height: "33.6px",
              color: "white",
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              borderRadius: "4px",
            }}
          >
            <Icon icon="uil:setting" />
            Configure Table
          </Button>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Button
              style={{
                background: "#7A2731",
                height: "33.6px",
                color: "white",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "4px",
                border: "1px solid #7A2731",
              }}
              onClick={() => showConfirm()}
            >
              {/* <Icon icon="uil:setting" /> */}
              <Icon fontSize="16px" icon="mingcute:delete-line" />
              Delete
            </Button>
            <PageHeader pageName="" buttons={buttons} setOpen={setOpen} />
          </div>
        </div>
        <Spin spinning={loading === true ? { loading } : null}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            // onChange={handleChange}
            columns={columns}
            dataSource={modifiedDataSource}
            rowSelection={{
              ...rowSelection,
            }}
            rowKey="id"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [5, 50, dataSource.length],
            }}
            // onRow={rowProps}
            scroll={{
              x: 2040,
            }}
          />
        </Spin>
      </DefaultCard>
    </div>
    // </Spin>
  );
};

export default Index;
const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);
