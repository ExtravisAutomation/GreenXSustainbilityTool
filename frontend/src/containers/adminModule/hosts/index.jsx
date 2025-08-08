import React, { useEffect, useState } from "react";
import { Popconfirm, Spin } from "antd";
import { useTheme } from "@mui/material/styles";
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
import { fetchHostsAsync } from "../../../store/features/vmModule/host/slices/hostSlice";
import useColumnSearchProps from "../../../hooks/useColumnSearchProps";
import { BaseUrl } from "../../../utils/axios";
import axios from "axios";
const Hosts = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();

  const getHosts = async () => {
    dispatch(fetchHostsAsync());
  };
  useEffect(() => {
    getHosts();
  }, [dispatch]);
  const hosts = useSelector((state) => state.hostsData);
  const hostsLoader = hosts.status;
  useEffect(() => {
    setDataSource(hosts.hosts);
  }, [hosts]);
  console.log(dataSource, "hosts data");
  const handleDelete = (key) => {
    console.log(key);
    // const newData = dataSource.filter((item) => item.key !== key);
    // setDataSource(newData);
  };
  const columns = [
    {
      title: "Host Name",
      dataIndex: "host_name",
      key: "host_name",
      // ...getColumnSearchProps("host_name"),
      // sorter: (a, b) => a.host_name?.localeCompare(b.host_name),

      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`host-details`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      // ...getColumnSearchProps("ip_address"),
      // sorter: (a, b) => a.ip_address?.localeCompare(b.ip_address),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      // ...getColumnSearchProps("model"),
      // sorter: (a, b) => {
      //   const modelA = String(a.model);
      //   const modelB = String(b.model);
      //   return modelA.localeCompare(modelB);
      // },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // ...getColumnSearchProps("name"),
      // sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Total CPU (mhz)",
      dataIndex: "total_cpu_mhz",
      key: "total_cpu_mhz",
      // ...getColumnSearchProps("total_cpu_mhz"),
      // sorter: (a, b) => a.total_cpu_mhz?.localeCompare(b.total_cpu_mhz),
    },
    {
      title: "Total Memory (gb)",
      dataIndex: "total_memory_gb",
      key: "total_memory_gb",
      // ...getColumnSearchProps("total_memory_gb"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.total_memory_gb);
      //   const usedmB = String(b.total_memory_gb);
      //   return usedmA.localeCompare(usedmB);
      // },
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      // ...getColumnSearchProps("manufacturer"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.manufacturer);
      //   const usedmB = String(b.manufacturer);
      //   return usedmA.localeCompare(usedmB);
      // },
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      // ...getColumnSearchProps("model"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.model);
      //   const usedmB = String(b.model);
      //   return usedmA.localeCompare(usedmB);
      // },
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      // ...getColumnSearchProps("version"),
      // sorter: (a, b) => {
      //   const usedmA = String(a.version);
      //   const usedmB = String(b.version);
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
      <Spin spinning={hostsLoader === "loading" ? hostsLoader : false}>
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

export default Hosts;
