import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useTheme } from "@mui/material/styles";
import { GrPowerReset } from "react-icons/gr";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
export default function useColumnSearchProps() {
  const theme = useTheme();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "end", marginBottom: "5px" }}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
            icon={
              <IoCloseCircleSharp
                style={{ fontSize: "22px", color: "#a64629" }}
              />
            }
          ></Button>
        </div>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
            borderColor: "gray",
            marginBottom: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<IoIosSearch style={{ fontSize: "18px" }} />}
            size="small"
            style={{
              width: 30,
              backgroundColor: "rgb(32, 154, 195)",
            }}
          ></Button>
          <Button
            type="primary"
            onClick={() => clearFilters && handleReset(clearFilters)}
            icon={<GrPowerReset />}
            size="small"
            style={{
              width: 30,
              backgroundColor: "rgb(32, 154, 195)",
            }}
          ></Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered
            ? theme?.palette?.default_table?.search_filtered_icon
            : theme?.palette?.default_table?.search_icon,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        ?.toLowerCase()
        .includes(value?.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text?.toString() : ""}
        />
      ) : (
        text
      ),
  });

  return getColumnSearchProps;
}
