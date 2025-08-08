import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import DefaultCard from '../../../components/cards.jsx';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables.jsx';
import { useNavigate } from 'react-router-dom';

import useWindowDimensions from '../../../hooks/useWindowDimensions.js';

import useColumnSearchProps from '../../../hooks/useColumnSearchProps.js';

import { Spin, Button, Modal, Input, Form, message, Tooltip } from 'antd';

import KpiSelector from '../../dashboardModule/dashboard/kpiSelector.jsx';
import { CustomInput } from '../../../components/customInput.jsx';
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import CustomModal from '../../../components/customModal.jsx';
import StyledFormItem from '../../../components/styledFormItem.jsx';
import {
  addPasswordGroup,
  deletePasswordGroup,
  editPasswordGroup,
  fetchPasswordGroup,
} from '../../../store/features/dashboardModule/actions/passwordGroupAction.js';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmLogoutModal from '../../../components/ConfirmLogoutModal.jsx';

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
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null); // for edit
  const [deleteId, setDeleteId] = useState(null);

  const [form] = Form.useForm(); // Initialize the form instance

  // theme
  const theme = useTheme();
  const navigate = useNavigate();

  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();
  const dispatch = useDispatch();

  // const [access_token, setAccessToken] = useState("");
  const access_token = localStorage.getItem('access_token');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const {
    data,
    loading: passwordGroupLoading, // renamed to avoid conflict
    error,
  } = useSelector((state) => state.password_group);
  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const { confirm } = Modal;

  // Fetch data on mount
  useEffect(() => {
    const userToken = localStorage.getItem('access_token');
    setToken(userToken);
    dispatch(fetchPasswordGroup(userToken));
  }, [dispatch]);

  // Sync Redux data to local dataSource
  useEffect(() => {
    if (data) {
      setDataSource(data);
    }
  }, [data]);
  // Set form values when editing
  useEffect(() => {
    if (isEdit && currentRecord) {
      form.setFieldsValue(currentRecord);
    }
  }, [isEdit, currentRecord, form]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleDelete = (id) => {
    dispatch(deletePasswordGroup(id));
  };

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredData(extra.currentDataSource);
  };

  // const showConfirm = async (id) => {
  //   confirm({
  //     title: (
  //       <span style={{ color: 'gray' }}>Are you sure you want to delete?</span>
  //     ),
  //     icon: <ExclamationCircleFilled />,
  //     content: (
  //       <span style={{ color: 'gray' }}>
  //         Once you delete it will permanatly remove from the database. Are you
  //         sure you want to proceed?
  //       </span>
  //     ),
  //     okText: 'Yes',
  //     okType: 'primary',
  //     okButtonProps: {
  //       // disabled: true,
  //     },
  //     cancelText: 'No',
  //     onOk() {
  //       handleDelete(id);
  //     },
  //     onCancel() {},
  //   });
  // };

  //Delete modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const showConfirmModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    setIsModalOpen(false);
    handleDelete(deleteId);
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',

      render: (password) => '*'.repeat(password.length),
    },
    {
      title: 'Password Group Name',
      dataIndex: 'password_group_name',
      key: 'password_group_name',
    },
    {
      title: 'Password Group Type',
      dataIndex: 'password_group_type',
      key: 'password_group_type',
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
        <Icon
          fontSize={'16px'}
          // onClick={() => handleEdit(record)}
          onClick={() => {
            setOpen((prev) => !prev);

            setIsEdit(true);
            setCurrentRecord(record);
          }}
          icon="bx:edit"
        />
        <Icon
          onClick={() => {
            setDeleteId(record?.id);
            setIsModalOpen(true);
          }}
          fontSize={'14px'}
          icon="uiw:delete"
        />
      </div>
    ),
  });

  const onFinish = (values) => {
    console.log('Form submitted!', values);
    const editId = currentRecord?.id;
    isEdit
      ? dispatch(editPasswordGroup(editId, values, messageApi))
      : dispatch(addPasswordGroup(values, messageApi));
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    setIsEdit(false);
    setCurrentRecord(null);
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

  const getValidationMessage = (fieldName, isSelect = false) =>
    isSelect ? `Please select ${fieldName}` : `Please enter ${fieldName}`;

  const containsEmoji = (text) => {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
  };

  const emojiValidationRule = () => ({
    validator(_, value) {
      if (value && containsEmoji(value)) {
        return Promise.reject(new Error('Invalid character found'));
      }
      return Promise.resolve();
    },
  });

  const passwordValidationRule = () => ({
    validator(_, value) {
      if (!value) {
        return Promise.reject(new Error('Please enter Password'));
      }
      if (value.length < 8) {
        return Promise.reject(
          new Error('Password must be at least 8 characters long')
        );
      }
      if (!/[A-Z]/.test(value)) {
        return Promise.reject(
          new Error('Password must include at least one uppercase letter')
        );
      }
      if (!/[a-z]/.test(value)) {
        return Promise.reject(
          new Error('Password must include at least one lowercase letter')
        );
      }
      if (!/[0-9]/.test(value)) {
        return Promise.reject(
          new Error('Password must include at least one number')
        );
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return Promise.reject(
          new Error('Password must include at least one special character')
        );
      }
      return Promise.resolve();
    },
  });

  return (
    <>
      {contextHolder}
      <ConfirmLogoutModal
        isOpen={isModalOpen}
        onCancel={closeModal}
        onLogout={handleLogout}
        content={{
          title: 'Are you sure want to Delete Password Group',
          text: 'Once you delete it will permanatly remove from the database. Are you sure you want to proceed?',
        }}
        isDelete
      />
      <CustomModal
        open={open}
        title="Add Password Group"
        addPasswordGroup="true"
      >
        <StyledForm
          form={form}
          name="dynamic_form_item"
          layout="vertical"
          onFinish={onFinish}
        >
          <StyledFormItem
            name="password_group_name"
            rules={[
              {
                required: true,
                message: getValidationMessage('Password Group Name'),
              },
              emojiValidationRule(),
            ]}
            label="Password Group Name"
            theme={theme}
          >
            <CustomInput placeholder="Enter password group name" />
          </StyledFormItem>
          <StyledFormItem
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: getValidationMessage('User Name'),
              },
              emojiValidationRule(),
            ]}
            theme={theme}
          >
            <CustomInput placeholder="Username" />
          </StyledFormItem>
          <StyledFormItem
            name="password_group_type"
            label=" Password Group Type"
            rules={[
              {
                required: true,
                message: getValidationMessage('Password Group Type', true),
              },
            ]}
            theme={theme}
          >
            <KpiSelector
              placeholder="Select password group"
              passwordGroup="true"
              options={options}
            />
          </StyledFormItem>
          <StyledFormItem
            name="password"
            label="Password"
            rules={[
              { required: true },
              passwordValidationRule(),
              emojiValidationRule(),
            ]}
            theme={theme}
          >
            <CustomInput type="password" placeholder="Password" />
          </StyledFormItem>

          <StyledFormItem
            style={{
              marginTop: '30px',
              textAlign: 'end',
              display: 'flex',
              justifyContent: 'center',
            }}
            theme={theme}
          >
            <Button
              onClick={() => handleCancel()}
              style={{
                backgroundColor: '#a3050d',
                borderColor: '#a3050d',
                color: '#e5e5e5',
                borderRadius: '5px',
                marginRight: '20px',
              }}
              type="primary"
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
                borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
                color: '#e5e5e5',
              }}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </StyledFormItem>
        </StyledForm>
      </CustomModal>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: theme?.palette?.default_card?.background,
              color: theme?.palette?.main_layout?.primary_text,
              padding: '12px 0px 14px 15px',
              marginTop: '10px',
              width: '96.5%',
              margin: '0 auto',
            }}
          >
            <span>Resultes</span>
            <span
              style={{
                width: '27px',
                height: '27px',
                borderRadius: '100%',
                background: theme?.palette?.drop_down_button?.add_background,
                color: theme?.palette?.drop_down_button?.add_text,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
              }}
            >
              {filteredData.length > 0
                ? filteredData.length
                : dataSource
                  ? dataSource?.length
                  : ''}
            </span>
          </div>
        </div>
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
              <Button
                style={{
                  background: theme?.palette?.drop_down_button?.add_background,
                  color: theme?.palette?.drop_down_button?.add_text,
                  height: '38px',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderRadius: '4px',
                  border: 'none',
                }}
                onClick={() => setOpen(true)}
              >
                <Icon icon="lucide:plus" />
                Add Password Group
              </Button>
            </div>
          </div>
          <Spin spinning={loading}>
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
          </Spin>
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
