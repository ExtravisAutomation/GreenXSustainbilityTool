import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../components/cards.jsx';
import { Icon } from '@iconify/react';
import DefaultTable from '../../components/tables.jsx';
// import CustomModal from "./modal";
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../hooks/useWindowDimensions.js';

import useColumnSearchProps from '../../hooks/useColumnSearchProps.js';
import { Spin, Button, message } from 'antd';
// import { dataKeysArray } from "./constants";
import PageHeader from '../../components/pageHeader.jsx';
// import { Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BaseUrl } from '../../utils/axios/index.js';
import Swal from 'sweetalert2';
import {
  ExclamationCircleFilled,
  EyeOutlined,
  ImportOutlined,
  DeleteOutlined,
  ExportOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
// import ViewSiteDetail from "./viewSiteDetail";
// import { UseSelector } from "react-redux/es/hooks/useSelector";
import ExportButton from '../../components/exportButton.jsx';
import CustomSpin from '../../components/CustomSpin.jsx';

// import CustomProgress from "../../../components/customProgress";
// ===============
const Users = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // hooks
  const { height, width } = useWindowDimensions();
  const [filteredData, setFilteredData] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();
  // refs
  const sites = useSelector((state) => state.sites);

  // states
  const conicColors = {
    '0%': '#3CB371', // Medium Sea Green, a brighter but not too bright green
    '50%': '#2b548f', // Medium Slate Blue, a brighter and lively blue
    '100%': '#c4101e', // Tomato, a vibrant yet not too harsh red
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [ids, setIds] = useState([]);
  const [siteDetail, setSiteDetail] = useState();
  const { confirm } = Modal;
  const color = '#36424e';
  useEffect(() => {
    // setDataSource(sites?.sites);
  }, [sites]);

  const fetchSites = () => {
    // dispatch(fetchsitesAsync());
  };
  useEffect(() => {
    fetchSites();
  }, [dispatch]);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'site_name',
      key: 'site_name',
    },
    {
      title: 'Age',
      dataIndex: 'site_type',
      key: 'site_type',
    },
    {
      title: 'Email',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Country',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
  ];

  const handleDelete = async (id) => {
    // const response = await deleteSite(ids);

    // dispatch(deleteSiteAsync(id ? [id] : ids));

    try {
      const response = await axios.post(
        BaseUrl + `/sites/deletesite`,
        id ? [id] : ids
      );
      if (response.status == '200') {
        setIds([]);
        Swal.fire({
          title: 'Site deleted Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            container: 'custom-swal-container',
            title: 'custom-swal-title',
            confirmButton: 'custom-swal-button',
          },
          onClose: () => {},
        });
        fetchSites();
      }
    } catch (error) {
      setIds([]);

      Swal.fire({
        // title: error.response.data.message,
        title: `This site can't be deleted as it is used in rack`,
        text: `${error.response?.data.failed_deletes.map(
          (sites) => sites.name
        )}`,
        icon: 'error',
        confirmButtonText: 'OK',
        // timer: 2000,
        // timerProgressBar: true,
        customClass: {
          container: 'custom-swal-container-sites',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
        },
        onClose: () => {},
      });
    }

    // Log the response

    setIds([]);
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  // columns
  // let columns = columnGenerator(dataKeys, getColumnSearchProps, getTitle);
  const showConfirm = async (id) => {
    if (ids.length > 0 || id) {
      confirm({
        title: (
          <span style={{ color: 'gray' }}>
            Are you sure you want to delete?
          </span>
        ),
        icon: <ExclamationCircleFilled />,
        content: (
          <span style={{ color: 'gray' }}>
            Once you delete it will permanatly remove from the database. Are you
            sure you want to proceed?
          </span>
        ),
        okText: 'Yes',
        okType: 'primary',
        okButtonProps: {
          // disabled: true,
        },
        cancelText: 'No',
        onOk() {
          handleDelete(id);
        },
        onCancel() {},
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Select a user first!',
      });
      // Swal.fire({
      //   title: "Select a user first",
      //   icon: "error",
      //   confirmButtonText: "OK",
      //   customClass: {
      //     container: "custom-swal-container",
      //     title: "custom-swal-title",
      //     confirmButton: "custom-swal-button",
      //   },
      //   onClose: () => {},
      // });
    }
  };

  columns.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right',
    width: 100,
    render: (text, record) => (
      <div
        style={{
          display: 'flex',
          gap: '13px',
          // justifyContent: "center",
          alignItems: 'center',
          zIndex: 999,
        }}
      >
        {/* <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "16px" }}
        /> */}
        <Icon
          fontSize={'16px'}
          onClick={() => handleEdit(record)}
          icon="ri:edit-line"
        />
        <Icon
          onClick={() => showConfirm(record.id)}
          fontSize={'14px'}
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
      type: 'Import',
      icon: <ImportOutlined />,
      style: {
        background: '#7A2731',
        height: '33px',
        color: 'white',
        textTransform: 'capitalize',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',

        borderRadius: '4px',
        borderColor: '#7A2731',
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      setIds((prevSiteId) => [...prevSiteId, record.id]);
    },
    onSelectAll: (record, selected, selectedRows) => {
      setIds(selected.map((item) => item.id));
    },
  };

  return (
    <div>
      {/* <CustomModal
        handleClose={handleClose}
        open={open}
        recordToEdit={recordToEdit}
        fetchSites={fetchSites}
      /> */}
      {contextHolder}

      <Modal
        width="80%"
        open={open3}
        title={
          <h3 style={{ color: 'white', marginTop: '0px' }}>Site Details</h3>
        }
        // onOk={handleOk}
        onCancel={() => setOpen3(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button
              style={{
                backgroundColor: '#0490E7',
                borderColor: '#0490E7',
                color: 'white',
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
        {/* <ViewSiteDetail data={siteDetail} /> */}
      </Modal>

      <div
        style={{
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.main_layout?.primary_text,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '12px 0px 14px 15px',
          marginTop: '10px',
          width: '97%',
          margin: '0 auto',
          marginTop: '15px',
        }}
      >
        <span>Results</span>
        <span
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '100%',
            background: theme?.palette?.drop_down_button?.add_background,
            color: theme?.palette?.drop_down_button?.add_text,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '10px',
          }}
        >
          {filteredData.length > 0 ? filteredData.length : dataSource?.length}
        </span>
      </div>
      <DefaultCard sx={{ width: `${width - 90}px`, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            style={{
              textTransform: 'capitalize',
              fontWeight: '300px',
              background: '#7A2731',
              color: 'white',
              borderRadius: '4px',
              width: '100px',
              height: '32px',
              fontSize: '14px',
              border: '1px solid #7A2731',
            }}
            onClick={() => showConfirm()}
          >
            <DeleteOutlined />
            <span style={{ fontWeight: 400 }}>Delete</span>
          </Button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              marginLeft: 'auto',
              justifyContent: 'end',
              padding: '5px 0 10px 0',
            }}
          >
            <ExportButton
              dataSource={filteredData ? filteredData : dataSource}
              columns={columns}
              name="sites"
            />
          </div>
        </div>
        <CustomSpin spinning={sites.status === 'loading' ? true : false}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              ...rowSelection,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              setFilteredData(extra.currentDataSource);
            }}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [5, 50, dataSource?.length],
            }}
            // scroll={{
            //   x: 1200,
            // }}
          />
        </CustomSpin>
      </DefaultCard>
    </div>
    // </Spin>
  );
};

export default Users;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
