import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import Modal from "./modal";
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

  useEffect(() => {
    try {
      const response = axios.post(baseUrl + "/sites/getallsites");
      console.log(response, "login response");
      // if (response.data.access_token !== 0) {

      //   Swal.fire({
      //     title: "Login successfully",

      //     icon: "success",
      //     confirmButtonText: "OK",
      //     timer: 1000,
      //     timerProgressBar: true,
      //     onClose: () => {

      //       console.log("Popup closed");
      //     },
      //   });
      // } else {
      //   alert("Unexpected response from the server");
      // }
    } catch (err) {
      // else {
      //   alert("Login failed. Please check your credentials.");
      // }
    }
  }, []);
  // selectors
  const dataSource = useSelector(selectTableData);

  const columns = [
    {
      title: "Site Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Site Type",
      dataIndex: "site_type",
      key: "site_type",
      ...getColumnSearchProps("site_type"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),

      render: (record) => {
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
      title: "City",
      dataIndex: "city",
      key: "city",
      ...getColumnSearchProps("city"),
    },
    {
      title: "Facility",
      dataIndex: "facility",
      key: "facility",
      ...getColumnSearchProps("facility"),
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
      title: "Total Devices",
      dataIndex: "total_devices",
      key: "total_devices",
      ...getColumnSearchProps("total_devices"),
    },
    {
      title: "Region",
      dataIndex: "Region",
      key: "Region",
      ...getColumnSearchProps("Region"),
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      ...getColumnSearchProps("created_at"),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      ...getColumnSearchProps("updated_at"),
    },
  ];
  // dummy data to show
  const Site_Module_Data = [
    {
      name: "DXB",
      status: "Active",
      facility: "DSW",
      Region: "Dubai",
    },
    {
      name: "SHJ",
      status: "Active",
      facility: "DSW",
      Region: "Sharjah",
    },
    {
      name: "AUH",
      status: "In Active",
      facility: "DSW",
      Region: "Abu Dhabi",
    },
    {
      name: "FUJ",
      status: "In Active",
      facility: "DSW",
      Region: "Fujairah",
    },
    {
      name: "RAK",
      status: "Active",
      facility: "DSW",
      Region: "Ras Al-Khaimah",
    },
    {
      name: "UAQ",
      status: "Active",
      facility: "DSW",
      Region: "Umm Al Quwain",
    },
    {
      name: "AJM",
      status: "Active",
      facility: "DSW",
      Region: "Ajman",
    },
    {
      name: "AAN",
      status: "Active",
      facility: "DSW",
      Region: "Ajman",
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

  // handlers
  const deleteData = () => {
    deleteRecords(selectedRowKeys);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      handleCallbackAlert(
        "Are you sure you want to delete these records?",
        deleteData
      );
    } else {
      handleInfoAlert("No record has been selected to delete!");
    }
  };

  const handleEdit = (record) => {
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
    console.log("Various parameters", pagination, filters, sorter, extra);
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
        {/* <Icon  icon="bx:edit" /> */}
        <Icon
          fontSize={"16px"}
          onClick={() => handleEdit(record)}
          icon="ri:edit-line"
        />
        <Icon fontSize={"14px"} icon="uiw:delete" />
      </div>
    ),
  });

  // page header buttons
  const buttons = [
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
    },
  ];

  const onRowClick = (record) => {
    // navigate(`sitedetail`);
  };

  const rowProps = (record) => {
    return {
      onClick: () => onRowClick(record),
    };
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
      console.log(record, "record data");
      // const newFormId = { form_id: record.resp_id };
      // setFormId((prevFormId) => [...prevFormId, newFormId]);
    },
    onSelectAll: (record, selected, selectedRows) => {
      // console.log(record.userid, "user id from record");
      // console.log(selected, "selected data");
      // const newFormId = { form_id: record.resp_id };
      // setFormId((prevFormId) => [...prevFormId, newFormId]);
    },
  };

  return (
    <Spin spinning={isFetchRecordsLoading || isDeleteRecordsLoading}>
      <div>
        {open ? (
          <Modal
            handleClose={handleClose}
            open={open}
            recordToEdit={recordToEdit}
          />
        ) : null}

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
            {Site_Module_Data.length}
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
                height: "30px",
                color: "white",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "2px",
              }}
            >
              <Icon icon="uil:setting" />
              Configure Table
            </Button>
            <PageHeader pageName="" buttons={buttons} />
          </div>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            onChange={handleChange}
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={Site_Module_Data}
            rowSelection={{
              ...rowSelection,
            }}
            rowKey="name"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, Site_Module_Data.length],
            }}
            onRow={rowProps}
            scroll={{
              x: 1240,
            }}
          />
        </DefaultCard>
      </div>
    </Spin>
  );
};

export default Index;
