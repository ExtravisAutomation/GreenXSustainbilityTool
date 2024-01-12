import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import DefaultCard from "../../../components/cards";
import { Icon } from "@iconify/react";
import DefaultTable from "../../../components/tables";
import { getTitle } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import Modal from "./modal";
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


  //dummy data 

  const inventoryPageData = [
    {
        "name": "Spine 101",
        "status": "Active",
        "site": "DXB",
        "racks": "Rack AA",
        "manufacturer": "Cisco",
        "pue":" 75%",
        "power": "75%",
        "input_power":"206W",
        "device_type":"Device A",
        "traffic":"450.0Gb/s",
        "emission":"50.5g",
        "bandwidth":"30%",
        "pcr":"1.3 W/Gbps",
        "cost":"90AED"
    },
    {
      "name": "Spine 102",
      "status": "Active",
      "site": "DXB",
      "racks": "Rack AB",
      "manufacturer": "Cisco",
      "pue":" 45%",
      "power": "45%",
      "input_power":"100W",
      "device_type":"Device B",
      "emission":"40.0g",
      "bandwidth":"20%",
      "pcr":"1.2 W/Gbps",
      "cost":"100AED"
  },
  {
    "name": "PDUs",
    "status": "Active",
    "site": "DXB",
    "racks": "Rack CA",
    "manufacturer": "Vendor C",
    "pue":" 75%",
    "power": "75%",
    "input_power":"200W",
    "device_type":"Device C",
    "traffic":"11.2Mb/s",
    "emission":"30.0g",
    "bandwidth":"10.180%",
    "pcr":"128.2W/Gbps",
    "cost":"40AED"
  },
  {
    "name": "PDUs",
    "status": "Active",
    "site": "DXB",
    "racks": "Rack CB",
    "manufacturer": "Vendor D",
    "pue":" 80%",
    "power": "80%",
    "input_power":"200W",
    "device_type":"Device D",
    "traffic":"90.0Mb/s",
    "emission":"50.5g",
    "bandwidth":"15.90%",
    "pcr":"297.34W/Gbps",
    "cost":"60AED"
  },
  {
    "name": "server 01",
    "status": "Active",
    "site": "DXB",
    "racks": "Rack CC",
    "manufacturer": "Vendor E",
    "pue":" 45%",
    "power": "45%",
    "input_power":"300W",
    "device_type":"Device E",
    "traffic":"11.2Mb/s",
    "emission":"70.5g",
    "bandwidth":"23.5%",
    "pcr":"18789.9W/Gbps",
    "cost":"100AED"
  },
  {
    "name": "server 02",
    "status": "Active",
    "site": "DXB",
    "racks": "Rack CD",
    "manufacturer": "Vendor F",
    "pue":" 30%",
    "power": "30%",
    "input_power":"200W",
    "device_type":"Device F",
    "traffic":"9.0Mb/s",
    "emission":"70.5g",
    "bandwidth":"17.5%",
    "pcr":"297.34W/Gbps",
    "cost":"80AED"
  },
  {
    "name": "Leaf 201",
    "status": "Active",
    "site": "DXB",
    "racks": "Rack AC",
    "manufacturer": "Cisco",
    "pue":" 80%",
    "power": "80%",
    "input_power":"150W",
    "device_type":"Device G",
    "traffic":"2.5Kb/s",
    "emission":"30.0g",
    "bandwidth":"10.0%",
    "pcr":"1.1 W/Gbps",
    "cost":"50AED"
},
{
  "name": "Leaf 202",
  "status": "Active",
  "site": "DXB",
  "racks": "Rack AD",
  "manufacturer": "Cisco",
  "pue":" 75%",
  "power": "75%",
  "input_power":"200W",
  "device_type":"Device H",
  "traffic":"286.2Mb/s",
  "emission":"70.5g",
  "bandwidth":"10%",
  "pcr":"643.26 W/Gbps",
  "cost":"70AED"
},
{
  "name": "Leaf 203",
  "status": "Active",
  "site": "DXB",
  "racks": "Rack BA",
  "manufacturer": "Cisco",
  "pue":" 30%",
  "power": "30%",
  "input_power":"300W",
  "device_type":"Device I",
  "traffic":"250.0Gb/s",
  "emission":"80.2g",
  "bandwidth":"09.1%",
  "pcr":"128.2 W/Gbps",
  "cost":"40AED"
},
{
  "name": "Server 01",
  "status": "Active",
  "site": "DXB",
  "racks": "Rack BB",
  "manufacturer": "Vendor J",
  "pue":" 45%",
  "power": "45%",
  "input_power":"80W",
  "device_type":"Device J",
  "traffic":"11.2Mb/s",
  "emission":"50.5g",
  "bandwidth":"23.5%",
  "pcr":"488.6W/Gbps",
  "cost":"90AED"
},
{
  "name": "switch 301",
  "status": "Active",
  "site": "DXB",
  "racks": "Rack BC",
  "manufacturer": "Vendor A",
  "pue":" 80%",
  "power": "80%",
  "input_power":"150W",
  "device_type":"Device A",
  "traffic":"4.7Mb/s",
  "emission":"30.0g",
  "bandwidth":"30%",
  "pcr":"297.34W/Gbps",
  "cost":"80AED"
},
{
  "name": "switch 302",
  "status": "Active",
  "site": "DXB",
  "racks": "Rack Bd",
  "manufacturer": "Vendor B",
  "pue":" 30%",
  "power": "30%",
  "input_power":"200W",
  "device_type":"Device B",
  "traffic":"9.0Mb/s",
  "emission":"50.5g",
  "bandwidth":"20%",
  "pcr":"1879.9W/Gbps",
  "cost":"20AED"
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
    if (optionType === "All Inventory") {
      jsonToExcel(dataSource, "Inventory");
    } else if (optionType === "Template") {
      jsonToExcel([generateObject(dataKeys)], "inventory_template");
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
      // handleClick: handleExport,
      // options: [
      //   {
      //     type: "All Inventory",
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
    navigate(`inventorydetail`);
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
          <PageHeader pageName="Inventory" buttons={buttons} />
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            scroll={{ x: 2000 }}
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={inventoryPageData}
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
