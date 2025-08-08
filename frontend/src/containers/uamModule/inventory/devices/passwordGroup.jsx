import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import DefaultCard from '../../../../components/cards.jsx';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../../components/tables.jsx';
import { getTitle } from '../../../../utils/helpers/index.js';
import ExportButton from '../../../../components/exportButton.jsx';
import { useNavigate } from 'react-router-dom';
import SeedFormModal from '../modal.jsx';
import {
  useFetchRecordsQuery,
  useDeleteRecordsMutation,
} from '../../../../store/features/uamModule/inventory/apis.js';
import { useSelector } from 'react-redux';
import { selectTableData } from '../../../../store/features/uamModule/inventory/selectors.js';
import useWindowDimensions from '../../../../hooks/useWindowDimensions.js';
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleCallbackAlert,
} from '../../../../components/sweetAlertWrapper.jsx';
import {
  jsonToExcel,
  columnGenerator,
  generateObject,
} from '../../../../utils/helpers/index.js';
import useColumnSearchProps from '../../../../hooks/useColumnSearchProps.js';

import useErrorHandling from '../../../../hooks/useErrorHandling.js';
import { dataKeysArray } from '../constants.js';
import PageHeader from '../../../../components/pageHeader.jsx';
import { Spin, Button, Modal, Input, Form, message, Tooltip } from 'antd';
import CustomSelector from '../../../../components/customSelector.jsx';
import KpiSelector from '../../../dashboardModule/dashboard/kpiSelector.jsx';
import { Outlet } from 'react-router-dom';
import { CustomInput } from '../../../../components/customInput.jsx';
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
import { BaseUrl, baseUrl } from '../../../../utils/axios/index.js';
import axios from 'axios';
import CustomSpin from '../../../../components/CustomSpin.jsx';

const StyledForm = styled(Form)`
  margin: 20px !important;
  .ant-form-item-label > label {
    color: #e5e5e5;
    // font-weight: bold;
  }
`;
const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #0490e7 !important;
    padding: 10px 10px 15px 10px;
    margin-bottom: 40px;
  }

  .ant-modal-title {
    color: #e5e5e5;
    margin-top: 5px !important;
  }
  .ant-modal-content {
    padding: 0px 0px 5px 0px !important;
  }
`;
const PasswordGroup = () => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm(); // Initialize the form instance

  // theme
  const theme = useTheme();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // const [access_token, setAccessToken] = useState("");
  const access_token = localStorage.getItem('access_token');

  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState([]);

  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const { confirm } = Modal;
  const fetchPasswordGroups = async () => {
    try {
      const res = await axios.get(
        baseUrl + '/sites/sites/get_all_password_groups/',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setDataSource(res?.data?.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchPasswordGroups();
  }, []);
  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        baseUrl + `/sites/sites/delete_password_groups_by_ids/`,
        [id],
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res?.status == '200') {
        messageApi.open({
          type: 'success',
          content: res?.data?.message,
        });
        fetchPasswordGroups();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        messageApi.open({
          type: 'error',
          content: error.response.data.message,
        });
      } else {
        console.error(error);
      }
    }
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  const showConfirm = async (id) => {
    confirm({
      title: (
        <span style={{ color: 'gray' }}>Are you sure you want to delete?</span>
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
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username?.localeCompare(b.username),
      ...getColumnSearchProps('username'),

      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`inventorydetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      sorter: (a, b) => a.password?.localeCompare(b.password),

      ...getColumnSearchProps('password'),
    },
    {
      title: 'Password Group Name',
      dataIndex: 'password_group_name',
      key: 'password_group_name',
      sorter: (a, b) =>
        a.password_group_name?.localeCompare(b.password_group_name),

      ...getColumnSearchProps('password_group_name'),
    },
    {
      title: 'Password Group Type',
      dataIndex: 'password_group_type',
      key: 'password_group_type',
      sorter: (a, b) =>
        a.password_group_type?.localeCompare(b.password_group_type),
      ...getColumnSearchProps('password_group_type'),
    },
  ];

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
          gap: '10px',
          justifyContent: 'center',
        }}
      >
        {/* <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "17px" }}
        /> */}
        <Icon
          fontSize={'16px'}
          // onClick={() => handleEdit(record)}
          icon="bx:edit"
        />
        <Icon
          onClick={() => showConfirm(record.id)}
          fontSize={'14px'}
          icon="uiw:delete"
        />
      </div>
    ),
  });

  const onFinish = async (values) => {
    console.log(values);
    try {
      const res = await axios.post(
        baseUrl + '/sites/sites/create_password_groups',
        values,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res?.status == '200') {
        messageApi.open({
          type: 'success',
          content: res?.data?.message,
        });
        fetchPasswordGroups();
        form.resetFields();
      }
      console.log('password group add', res);
    } catch (error) {}
    setOpen(false);
  };

  const options = [
    {
      value: 'http',
      label: 'http',
    },
    {
      value: 'ssh',
      label: 'ssh',
    },
    {
      value: 'snmp',
      label: 'snmp',
    },
  ];
  return (
    <>
      {contextHolder}
      <StyledModal
        width="500px"
        open={open}
        title="Add Password Group"
        // onOk={handleOk}
        onCancel={() => setOpen(false)}
        footer={(_, { OkBtn, CancelBtn }) => <></>}
        closeIcon={<CustomCloseIcon />}
        style={{
          top: 20,
        }}
      >
        <StyledForm
          form={form}
          name="dynamic_form_item"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="password_group_name"
            rules={[
              {
                required: true,
                message: 'Please input Password Group Name',
              },
            ]}
            label="Password Group Name"
          >
            <CustomInput placeholder="Enter password group name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your user name',
              },
            ]}
          >
            <CustomInput placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password_group_type"
            label=" Password Group Type"
            rules={[
              {
                required: true,
                message: 'Please input your user name',
              },
            ]}
          >
            <KpiSelector passwordGroup="true" options={options} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
          >
            <CustomInput placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ marginTop: '30px', textAlign: 'end' }}>
            <Button
              style={{
                backgroundColor: 'transparent',
                borderColor: '#36424e',
                color: '#e5e5e5',
                marginRight: '10px',
              }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: '#0490e7',
                borderColor: '#0490e7',
                color: '#e5e5e5',
              }}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </StyledForm>
      </StyledModal>
      <div>
        <DefaultCard sx={{ width: `${width - 105}px` }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ color: 'white' }}>Password Group</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                width: '40%',
                marginLeft: 'auto',
                justifyContent: 'end',
              }}
            >
              <ExportButton
                dataSource={dataSource ? dataSource : []}
                columns={columns}
                name="password_groups"
              />

              <Button
                style={{
                  background: '#0490E7',
                  height: '33px',
                  color: 'white',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderRadius: '4px',
                  borderColor: '#0490E7',
                }}
                onClick={() => setOpen(true)}
              >
                <Icon icon="lucide:plus" />
                Add Password Group
              </Button>
            </div>
          </div>
          <CustomSpin spinning={loading}>
            <DefaultTable
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'even' : 'odd'
              }
              size="small"
              onChange={handleChange}
              columns={columns}
              dataSource={dataSource}
              rowKey="id"
              style={{ whiteSpace: 'pre' }}
              pagination={{
                defaultPageSize: 10,
                pageSizeOptions: [10, 50, 100, dataSource?.length],
              }}
              scroll={{
                x: 1200,
              }}
            />
          </CustomSpin>
        </DefaultCard>
        {/* <Outlet /> */}
      </div>
    </>
  );
};

export default PasswordGroup;
const CustomCloseIcon = () => (
  <span style={{ color: '#e5e5e5' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
