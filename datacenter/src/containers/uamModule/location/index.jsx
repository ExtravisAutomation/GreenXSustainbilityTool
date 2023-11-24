import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import Modal from "./modal";
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from "../../../store/features/uamModule/location/apis";
import { useSelector } from "react-redux";
import { selectTableData } from "../../../store/features/uamModule/location/selectors";
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

const Index = () => {
  // theme
  const theme = useTheme();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // refs

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);

  // selectors
  const dataSource = useSelector(selectTableData);

//dummy data 

const locationPageData = [

    {

        "name": "Location A",

        "site": "UAE Data Hub 1",

        "location": "Section A, Floor 1",

        "height": "Multiple Racks (42U each)",

        "devices": [

            "Rack A1 (Servers, Switches)",

            "Rack A2 (Storage, Network Equipment)"

        ],

        "space": "85% Utilized",

        "power": "15 kW"

    },

    {

        "name": "Location B",

        "site": "Desert Cloud Center",

        "location": "Section B, Floor 2",

        "height": "Multiple Racks (48U each)",

        "devices": [

            "Rack B1 (Servers, Routers)",

            "Rack B2 (NAS, Firewall)"

        ],

        "space": "70% Utilized",

        "power": "20 kW"

    },

    {

        "name": "Location C",

        "site": "Emerald Data Services",

        "location": "Section C, Floor 3",

        "height": "Multiple Racks (45U each)",

        "devices": [

            "Rack C1 (Application Servers)",

            "Rack C2 (Database Servers, Backup Systems)"

        ],

        "space": "90% Utilized",

        "power": "18 kW"

    },

    // Additional location data can be added in a similar format

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
        "Are you sure you want delete these records?",
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
    if (optionType === "All Locations") {
      jsonToExcel(dataSource, "Locations");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "location_template");
    }
    handleSuccessAlert("File exported successfully.");
  };

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // columns
  let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);

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
        <Icon onClick={() => handleEdit(record)} icon="bx:edit" />
      </div>
    ),
  });

  // page header buttons
  const buttons = [
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      handleClick: handleExport,
      options: [
        {
          type: "All Locations",
          icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
        },
        {
          type: "Template",
          icon: (
            <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
          ),
        },
      ],
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      handleClick: handleDelete,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      handleClick: handleAdd,
    },
  ];

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

        <DefaultCard sx={{ width: `${width - 105}px` }}>
          <PageHeader pageName="Locations" buttons={buttons} />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: 1000 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={locationPageData}
            rowKey="location_id"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, 100, 500, 1000],
            }}
          />
        </DefaultCard>
      </div>
    </Spin>
  );
};

export default Index;
