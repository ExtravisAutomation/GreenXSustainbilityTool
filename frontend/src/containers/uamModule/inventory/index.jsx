import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables';
import { getTitle } from '../../../utils/helpers';
import ExportButton from '../../../components/exportButton.jsx';
import { useNavigate } from 'react-router-dom';
import SeedFormModal from './modal';
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from '../../../store/features/uamModule/inventory/apis';
import { useSelector } from 'react-redux';
import { selectTableData } from '../../../store/features/uamModule/inventory/selectors';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
} from '../../../components/sweetAlertWrapper';
import {
  jsonToExcel,
  columnGenerator,
  generateObject,
} from '../../../utils/helpers';
import useColumnSearchProps from '../../../hooks/useColumnSearchProps';
import { Spin, Button } from 'antd';
import useErrorHandling from '../../../hooks/useErrorHandling';
import { dataKeysArray } from './constants';
import PageHeader from '../../../components/pageHeader';
import { Modal, Input, Form, message } from 'antd';
import { Outlet } from 'react-router-dom';
import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import { BaseUrl, baseUrl } from '../../../utils/axios';
import axios from 'axios';
import SeedDetails from './seedDetails';
import CustomProgress from '../../../components/customProgress';
import CustomPagination from '../../../components/customPagination';
import HorizontalMenu from '../../../components/horizontalMenu.jsx';
import SubHorizontalMenu from '../../../components/subHorizontalMenu.jsx';
const conicColors = {
  '0%': '#3CB371', // Medium Sea Green, a brighter but not too bright green
  '50%': '#2b548f', // Medium Slate Blue, a brighter and lively blue
  '100%': '#c4101e', // Tomato, a vibrant yet not too harsh red
};
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
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [access_token, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [inventoryPageData, setInventoryPageData] = useState([]);
  const [seedDetail, setSeedDetail] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const [currentPage, setCurrentPage] = useState(1); // State to track current page

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const { confirm } = Modal;
  const menuItems = [
    {
      id: 'devices',
      name: 'Devices',
      path: 'devices',
    },
  ];

  const onFinish = async (values) => {
    if (values.ips) {
      values.ips.push(values.ip);
      delete values['ip'];
      setOpen2(false);
    } else {
    }
  };

  // const handleOk = () => {
  //   setOpen(false);
  // };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
  };

  const handleChange = (pagination, filters, sorter, extra) => {};

  // row selection
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const viewDetails = (record) => {
    setSeedDetail(record);
    setOpen3(true);
  };

  return (
    <div>
      {contextHolder}
      {open ? (
        <SeedFormModal
          handleClose={handleClose}
          open={open}
          recordToEdit={recordToEdit}
        />
      ) : null}

      <Modal
        open={open2}
        title={<h3 style={{ color: 'white', marginTop: '0px' }}>Fill form</h3>}
        // onOk={handleOk}
        onCancel={() => setOpen2(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <Button>Custom Button</Button> */}
            <CancelBtn />
            {/* <OkBtn /> */}
          </>
        )}
        closeIcon={<CustomCloseIcon />}
      >
        <Form name="dynamic_form_item" onFinish={onFinish}>
          <Form.Item
            name="user"
            rules={[
              {
                required: true,
                message: 'Please input your user!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="User"
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
          >
            <Input
              // prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Password"
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <div style={{ position: 'relative' }}>
            <Form.Item
              style={{ Bottom: '30px' }}
              name="ip"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input ip address or delete this field.',
                },
              ]}
              noStyle
            >
              <Input
                placeholder="ip address"
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.List name="ips">
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      // label={index === 0 ? "IP" : ""}
                      required={false}
                      key={field.key}
                      className="custom-label-color"
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '5px',
                          width: '100%',
                          marginTop: index === 0 ? '25px' : '',
                        }}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                'Please input ip address or delete this field.',
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="ip address"
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                        {fields.length > 0 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}

                  <Button
                    type="solid"
                    onClick={() => add()}
                    style={{
                      width: '40px',
                      position: 'absolute',
                      top: -0.3,
                      right: 0,
                      border: '1px solid #0490e7',
                      borderRadius: '0px 6px 6px 0px',
                    }}
                    icon={<PlusOutlined />}
                  ></Button>
                </>
              )}
            </Form.List>
          </div>
          <Form.Item style={{ marginTop: '30px' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width="100%"
        open={open3}
        title={
          <h3 style={{ color: 'white', marginTop: '0px' }}>Seed Details</h3>
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
        <SeedDetails data={seedDetail} />
      </Modal>
      <div style={{ width: '97.5%', margin: '0 auto' }}>
        {/* <HorizontalMenu menuItems={menuItems} defaultPage="Devices" /> */}
        <SubHorizontalMenu menuItems={menuItems} />
      </div>
      {/* <div
        style={{
          width: "97.5%",
          // padding: "0 40px 0 10px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
              width: "27px",
              height: "27px",
              borderRadius: "100%",
              background: "#0490E7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
            }}
          >
            {inventoryPageData?.length}
          </span>
        </div>
        <Button
          style={{
            background: "#0490E7",
            height: "33px",
            color: "white",
            textTransform: "capitalize",

            borderRadius: "4px",
            borderColor: "#0490E7",
            marginRight: "10px",
          }}
          // onClick={() => setOpen2(true)}
          onClick={onBoard}
        >
          OnBoard Device
        </Button>
      </div> */}

      <Outlet />
    </div>
  );
};

export default Index;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
