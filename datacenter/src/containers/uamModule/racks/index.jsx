import React, { useState } from "react";
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
import { Spin } from "antd";
import useErrorHandling from "../../../hooks/useErrorHandling";
import { dataKeysArray } from "./constants";
import PageHeader from "../../../components/pageHeader";


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

  // selectors
  const dataSource = useSelector(selectTableData);



  //dummy data to show

  const rackPageData = [
    {
        "name": "Rack AA",
        "site": "DXB",
        "location": "Row_1",
        "height": "RU42",
        "devices": "03",
        "space": "23% Utilized",
        "power": "5 kW"
    },
    {
      "name": "Rack AB",
      "site": "DXB",
      "location": "Row_1",
      "height": "RU42",
      "devices": "04",
      "space": "26% Utilized",
      "power": "15 kW"
  },
  {
    "name": "Rack AC",
    "site": "DXB",
    "location": "Row_1",
    "height": "RU42",
    "devices": "01",
    "space": "16% Utilized",
    "power": "40 kW"
},
{
  "name": "Rack AD",
  "site": "DXB",
  "location": "Row_1",
  "height": "RU42",
  "devices": "03",
  "space": "16% Utilized",
  "power": "15 kW"
},

{
  "name": "Rack BA",
  "site": "DXB",
  "location": "Row_2",
  "height": "RU42",
  "devices": "03",
  "space": "18% Utilized",
  "power": "65 kW"
},
{
  "name": "Rack BB",
  "site": "DXB",
  "location": "Row_2",
  "height": "RU42",
  "devices": "05",
  "space": "45% Utilized",
  "power": "80 kW"
},

{
  "name": "Rack BC",
  "site": "DXB",
  "location": "Row_2",
  "height": "RU42",
  "devices": "02",
  "space": "20% Utilized",
  "power": "30 kW"
},
{
  "name": "Rack BD",
  "site": "DXB",
  "location": "Row_2",
  "height": "RU42",
  "devices": "03",
  "space": "50% Utilized",
  "power": "50 kW"
},
{
  "name": "Rack CA",
  "site": "DXB",
  "location": "Row_3",
  "height": "RU42",
  "devices": "01",
  "space": "50% Utilized",
  "power": "20 kW"
},

{
  "name": "Rack CB",
  "site": "DXB",
  "location": "Row_3",
  "height": "RU42",
  "devices": "01",
  "space": "46% Utilized",
  "power": "20 kW"
},
{
  "name": "Rack CC",
  "site": "DXB",
  "location": "Row_3",
  "height": "RU42",
  "devices": "04",
  "space": "20% Utilized",
  "power": "75 kW"
},
{
  "name": "Rack CD",
  "site": "DXB",
  "location": "Row_3",
  "height": "RU42",
  "devices": "03",
  "space": "50% Utilized",
  "power": "50 kW"
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
    if (optionType === "All Racks") {
      jsonToExcel(dataSource, "Racks");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "rack_template");
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
        {/* <Icon onClick={() => handleEdit(record)} icon="bx:edit" /> */}
      </div>
    ),
  });

  // page header buttons
  const buttons = [
    {
      type: "Export",
      icon: <Icon fontSize="16px" icon="fe:export" />,
      // handleClick: handleExport,
      // options: [
      //   {
      //     type: "All Racks",
      //     icon: <Icon fontSize="16px" icon="icon-park-outline:data-all" />,
      //   },
      //   {
      //     type: "Template",
      //     icon: (
      //       <Icon fontSize="16px" icon="streamline:chat-bubble-square-write" />
      //     ),
      //   },
      // ],
    },
    {
      type: "Delete",
      icon: <Icon fontSize="16px" icon="mingcute:delete-line" />,
      // handleClick: handleDelete,
    },
    {
      type: "Add",
      icon: <Icon fontSize="16px" icon="gridicons:add-outline" />,
      // handleClick: handleAdd,
    },    
  ];
  const onRowClick = (record) => {
    navigate(`rackdetail`);
  };

  const rowProps = (record) => {
    return {
      onClick: () =>
       onRowClick(record),
   
    };
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

        <DefaultCard sx={{ width: `${width - 105}px` }}>
          <PageHeader pageName="Racks" buttons={buttons} />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: 1000 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={rackPageData}
            rowKey="name"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [9, 50, 100, 500, 1000],
            }}
            onRow={rowProps}
          />
        </DefaultCard>
      </div>
    </Spin>
  );
};

export default Index;
