import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Popconfirm, Spin } from "antd";
import {
  ExclamationCircleFilled,
  EyeOutlined,
  ImportOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  RightOutlined,
} from "@ant-design/icons";
import DefaultCard from "../../../components/cards";
import DefaultTable from "../../../components/tables";
import ExportButton from "../../../components/exportButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVMsAsync } from "../../../store/features/vmModule/vm/slices/vmSlice";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";
import { BaseUrl } from "../../../utils/axios";
import axios from "axios";
const VirtualMachines = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();

  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "VM 1",
  //     age: "Running",
  //     address: "50GB",
  //     guestOS: "Linux",
  //     hostName: "Host A",
  //     hostCPU: "Intel Xeon E5-2670",
  //     hostMemory: "32GB",
  //   },
  //   {
  //     key: "2",
  //     name: "VM 2",
  //     age: "Stopped",
  //     address: "20GB",
  //     guestOS: "Windows Server 2019",
  //     hostName: "Host B",
  //     hostCPU: "AMD Ryzen 7 3700X",
  //     hostMemory: "64GB",
  //   },
  //   {
  //     key: "3",
  //     name: "VM 3",
  //     age: "Running",
  //     address: "100GB",
  //     guestOS: "Ubuntu",
  //     hostName: "Host C",
  //     hostCPU: "Intel Core i7-10700K",
  //     hostMemory: "16GB",
  //   },
  //   // Add more dummy data as needed
  // ];

  const getVms = () => {
    dispatch(fetchVMsAsync());
  };
  useEffect(() => {
    getVms();
  }, [dispatch]);
  const vms = useSelector((state) => state.vmsData);
  const vmsLoader = vms.status;
  useEffect(() => {
    setDataSource(vms.vms);
  }, [vms]);
  console.log(vmsLoader, "vms data");
  const handleDelete = (key) => {
    console.log(key);
    // const newData = dataSource.filter((item) => item.key !== key);
    // setDataSource(newData);
  };
  const columns = [
    {
      title: "Virtual Machine",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name?.localeCompare(b.name),

      onCell: (record) => ({
        onClick: () => {
          navigate(`vm-details`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // ...getColumnSearchProps("status"),
      // sorter: (a, b) => a.status?.localeCompare(b.status),
      render: (record) => {
        return (
          <div>
            {record == "Active" ? (
              <div
                style={{
                  background: theme?.palette?.status?.background,
                  width: "59px",
                  textAlign: "center",
                  height: "18px",
                  borderRadius: "24px",
                  color: theme?.palette?.status?.color,
                  padding: "2px 5px",
                }}
              >
                {record}
              </div>
            ) : record == "In Active" ? (
              <div
                style={{
                  background: "#D21E164A",
                  width: "59px",
                  textAlign: "center",
                  height: "18px",
                  borderRadius: "24px",
                  color: "#D21E16",
                  padding: "2px 5px",
                }}
              >
                {record}
              </div>
            ) : record == "Maintainance" ? (
              <div
                style={{
                  background: "#FFC3004A",
                  color: "#FFC300",
                  width: "85px",
                  textAlign: "center",
                  height: "18px",
                  borderRadius: "24px",
                  padding: "2px 5px",
                }}
              >
                {record}
              </div>
            ) : (
              record
            )}
          </div>
        );
      },
      // render: (record) => (
      //   <div
      //     style={{
      //       background: record === "Active" ? "#71B62633" : "",
      //       color: record === "Active" ? "#C8FF8C" : "",

      //       opacity: "90%",
      //       width: "50px",
      //       // height: "30px",
      //       textAlign: "center",
      //       borderRadius: "10px",
      //     }}
      //   >
      //     {record === "green" ? "Active" : record}
      //   </div>
      // ),
    },
    {
      title: "Used Space (GB)",
      dataIndex: "used_space_GB",
      key: "used_space_GB",
      // ...getColumnSearchProps("used_space_GB"),
      // sorter: (a, b) => {
      //   const used_space_GBA = String(a.used_space_GB);
      //   const used_space_GBB = String(b.used_space_GB);
      //   return used_space_GBA.localeCompare(used_space_GBB);
      // },
    },
    {
      title: "Guest OS",
      dataIndex: "guest_os",
      key: "guest_os",
      // ...getColumnSearchProps("guest_os"),
      // sorter: (a, b) => a.guest_os?.localeCompare(b.guest_os),
    },
    {
      title: "Host name",
      dataIndex: "hostname",
      key: "hostname",
      // ...getColumnSearchProps("hostname"),
      // sorter: (a, b) => a.hostname?.localeCompare(b.hostname),
    },
    {
      title: "Used CPU (MHz)",
      dataIndex: "used_cpu_MHz",
      key: "used_cpu_MHz",
      // ...getColumnSearchProps("used_cpu_MHz"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.used_cpu_MHz);
      //   const usedmB = String(b.used_cpu_MHz);
      //   return usedmA.localeCompare(usedmB);
      // },
    },
    {
      title: "Used Memory (MB)",
      dataIndex: "used_memory_MB",
      key: "used_memory_MB",
      // ...getColumnSearchProps("used_memory_MB"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.used_memory_MB);
      //   const usedmB = String(b.used_memory_MB);
      //   return usedmA.localeCompare(usedmB);
      // },
    },
  ];
  columns.push({
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    fixed: "right",
    width: 100,

    render: (_, record) => (
      <>
        <div
          style={{
            display: "flex",
            gap: "13px",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined style={{ fontSize: "14px" }} />
          </Popconfirm>
          <EditOutlined style={{ fontSize: "14px" }} />
        </div>
      </>
    ),
  });
  return (
    <div>
      <div
        style={{
          color: theme?.palette?.default_card?.color,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: theme?.palette?.default_card?.background,
          padding: "12px 0px 14px 15px",
          marginTop: "10px",
          width: "96%",
          margin: "0 auto",
        }}
      >
        <span>Results</span>
        <span
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "100%",
            background: theme?.palette?.drop_down_button?.add_background,
            color: theme?.palette?.drop_down_button?.add_text,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
          }}
        >
          {dataSource?.length}
        </span>
      </div>
      <Spin spinning={vmsLoader === "loading" ? vmsLoader : false}>
        <DefaultCard
          sx={{
            background: "#141B26",
            //   padding: "0px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "8px",
            }}
          >
            <ExportButton columns={columns} dataSource={dataSource} />
          </div>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
            size="small"
            columns={columns}
            dataSource={dataSource}
            //   rowSelection={{
            //     ...rowSelection,
            //   }}
            rowKey="id"
            style={{ whiteSpace: "pre" }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, dataSource?.length],
            }}
            scroll={{
              x: 2000,
            }}
          />
        </DefaultCard>
      </Spin>
    </div>
  );
};

export default VirtualMachines;
