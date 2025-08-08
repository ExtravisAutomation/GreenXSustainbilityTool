import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards.jsx';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables.jsx';
import ExportButton from '../../../components/exportButton.jsx';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../../store/features/notificationslice.jsx';
import { useSelector } from 'react-redux';
import useWindowDimensions from '../../../hooks/useWindowDimensions.js';
import useColumnSearchProps from '../../../hooks/useColumnSearchProps.js';
import { Spin, Button } from 'antd';
import { dataKeysArray } from '../../uamModule/sites/constants.js';
import PageHeader from '../../../components/pageHeader.jsx';
import { Modal, Input, Form, message, Tooltip, Switch, Dropdown } from 'antd';
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
import { BaseUrl, baseUrl } from '../../../utils/axios/index.js';
import axios from 'axios';
import SeedDetails from '../../uamModule/inventory/seedDetails.jsx';
import CustomProgress from '../../../components/customProgress.jsx';
import CustomModalSeeds from '../../uamModule/inventory/modal.jsx';
import { FaArrowUp } from 'react-icons/fa6';
import UploadFile from '../../../components/uploadFile.jsx';
import { saveAs } from 'file-saver';
import { ExportOutlined } from '@ant-design/icons';
import CustomDropdown from '../../../components/customDropDown.jsx';
import { MdOutlineRestartAlt } from 'react-icons/md';
import AddDeviceForm from './addDeviceForm.jsx';
import CustomModal from '../../../components/customModal.jsx';
import { CustomInput } from '../../../components/customInput.jsx';
import axiosInstance from '../../../utils/axios/axiosInstance.js';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { renderStatusTag } from '../../../utils/utils.js';
import { AppContext } from '../../../context/appContext.js';
import {
  deleteOnBoardDevice,
  makeOnboardDevices,
} from '../../../services/onBoardingModule/onBoardingDeviceServices.js';
import CustomSpin from '../../../components/CustomSpin.jsx';
// import AddDeviceForm from "../../uamModule/inventory/addDeviceForm.jsx";

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-header {
    background-color: ${({ theme }) =>
      theme?.palette?.default_card?.background};
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-title {
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }

  .ant-modal-body {
    color: ${({ theme }) => theme?.palette?.main_layout?.primary_text};
  }
`;

const Devices = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { isMenuVisible, setMenuVisible } = useContext(AppContext);
  // hooks
  const { height, width } = useWindowDimensions();
  const getColumnSearchProps = useColumnSearchProps();

  // refs

  // states
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [openSeedModal, setOpenSeedModal] = useState(false);

  const [isLimitModalVisible, setIsLimitModalVisible] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState();

  // const [access_token, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventoryPageData, setInventoryPageData] = useState([]);
  const [seedDetail, setSeedDetail] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [filteredData, setFilteredData] = useState([]);
  const [revert, setRevert] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  console.log('selectedRowKeys:', selectedRowKeys);
  const access_token = localStorage.getItem('access_token');

  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const { confirm } = Modal;
  const color = '#36424e';
  console.log('uploaded file in state', uploadedFile);

  const fetchSeeds = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        BaseUrl + '/sites/sites/get_all_devices'
      );
      if (response) {
        setInventoryPageData((prev) => response?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeeds();
  }, []);

  const onFinish = async (values) => {
    if (values.ips) {
      values.ips.push(values.ip);
      delete values['ip'];
      setOpen2(false);
    } else {
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.post(
        baseUrl + '/sites/sites/delete_devices',
        [id]
      );
      console.log('delete res', res);
      if (res?.status == '200') {
        messageApi.open({
          type: 'success',
          content: res.data.message,
        });
        setInventoryPageData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        fetchSeeds();
      }
    } catch (error) {}
  };

  // API Service

  // const handleDelete = async (id) => {
  //   try {
  //     const res = await deleteOnBoardDevice(id);
  //     console.log('delete res', res);

  //     if (res?.status === 200) {
  //       message.success(res.data.message);

  //       setInventoryPageData((prevData) =>
  //         prevData.filter((item) => item.id !== id)
  //       );

  //       fetchSeeds();
  //     }
  //   } catch (error) {
  //     console.error('Delete failed:', error);
  //     message.error('Failed to delete the device.');
  //   }
  // };
  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpenSeedModal(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpenSeedModal(false);
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
  const revert_status = localStorage.getItem('revert');

  // Old
  const onBoard = async (id) => {
    if (onboardedDevicesCount > 50) {
      setIsLimitModalVisible(true);
    } else {
      if (selectedRowKeys?.length > 0 || id) {
        setLoading(true);
        const deviceId = [id];
        const payload = {
          device_ids: selectedRowKeys?.length > 0 ? selectedRowKeys : deviceId,
        };

        try {
          dispatch(
            showNotification({
              type: 'success',
              message: 'Devices onboarding started!',
            })
          );

          setLoading(false);

          const res = await axios.post(
            baseUrl + '/sites/sites/onboard_devices',
            payload,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setLoading(false);

          console.log('res:::', res);

          if (res.status === 200) {
            dispatch(
              showNotification({ type: 'success', message: res.data.message })
            );
            setSelectedRowKeys([]);
            fetchSeeds();
          } else {
            console.log('error response.......', res);
          }
        } catch (error) {
          setLoading(false);
          console.log('error.......', error);
          dispatch(
            showNotification({
              type: 'error',
              message: 'Onboarding failed. Please try again.',
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Please select at least one device!',
          })
        );
      }
    }
  };

  // api service for setting onBoarding Device
  // const onBoard = async (id) => {
  //   if (selectedRowKeys?.length > 0 || id) {
  //     setLoading(true);

  //     const deviceId = [id];
  //     const payloadIds =
  //       selectedRowKeys?.length > 0 ? selectedRowKeys : deviceId;

  //     try {
  //       dispatch(
  //         showNotification({
  //           type: 'success',
  //           message: 'Devices onboarding started!',
  //         })
  //       );

  //       const res = await makeOnboardDevices(payloadIds);
  //       setLoading(false);

  //       console.log('res:::', res);

  //       if (res.status === 200) {
  //         dispatch(
  //           showNotification({ type: 'success', message: res.data.message })
  //         );
  //         setSelectedRowKeys([]);
  //         fetchSeeds();
  //       } else {
  //         console.log('error response.......', res);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       console.error('Onboarding error:', error);
  //       dispatch(
  //         showNotification({
  //           type: 'error',
  //           message: 'Onboarding failed. Please try again.',
  //         })
  //       );
  //     }
  //   } else {
  //     dispatch(
  //       showNotification({
  //         type: 'error',
  //         message: 'Please select at least one device!',
  //       })
  //     );
  //   }
  // };

  const columns = [
    {
      title: 'IP Address',
      dataIndex: 'device_ip',
      key: 'device_ip',
      // onCell: (record) => ({
      //   onClick: () => {
      //     if (isMenuVisible) {
      //       setMenuVisible(false);
      //     }
      //     navigate(`/main_layout/uam_module/devices/devices/inventorydetail`, {
      //       state: {
      //         data: record,
      //         parent: 'Onboard Devices',
      //       },
      //     });
      //   },
      // }),
      render: (text, record) => {
        return (
          <span
            style={
              {
                // color: theme?.palette?.main_layout?.secondary_text,
                // fontWeight: 500,
              }
            }
          >
            {text}
          </span>
        );
      },
    },

    {
      title: 'Password Group Name',
      dataIndex: 'password_group_name',
      key: 'password_group_name',
      width: 180,
      // sorter: (a, b) =>
      //   a.password_group_name?.localeCompare(b.password_group_name),
      // ...getColumnSearchProps("password_group_name"),
    },

    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
      // sorter: (a, b) => a.site_name?.localeCompare(b.site_name),

      // ...getColumnSearchProps("site_name"),
    },
    {
      title: 'Rack Name',
      dataIndex: 'rack_name',
      key: 'rack_name',
      // sorter: (a, b) => a.rack_name?.localeCompare(b.rack_name),

      // ...getColumnSearchProps("rack_name"),
    },
    {
      title: 'Onboarding Status',
      dataIndex: 'OnBoardingStatus',
      key: 'OnBoardingStatus',

      render: (record) => renderStatusTag(record, theme),
    },
    {
      title: 'Date/Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => {
        if (!created_at) return '-';
        const formattedDate = new Date(created_at).toLocaleString();
        return formattedDate;
      },
    },
    {
      title: 'Collection Status',
      dataIndex: 'collection_status',
      key: 'collection_status',
      render: (record) => renderStatusTag(record, theme),
    },

    // {
    //   title: 'Messages',
    //   dataIndex: 'messages',
    //   key: 'messages',
    //   width: 300,

    //   render: (text) => (
    //     <div
    //       title={text}
    //       style={{
    //         maxWidth: '100%',
    //         // overflowX: '',
    //         whiteSpace: 'nowrap',
    //         // textOverflow: 'ellipsis',
    //       }}
    //     >
    //       {text}
    //     </div>
    //   ),
    // },
    {
      title: 'Messages',
      dataIndex: 'messages',
      key: 'messages',
      width: 250, // Column width remains fixed
      render: (text) => (
        <div
          title={text}
          style={{
            maxWidth: '100%',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {text}
        </div>
      ),
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
        {record.collection_status ? (
          <AiOutlinePauseCircle
            onClick={() => handleCollectionStatus(record)}
            style={{ fontSize: '17px' }}
          />
        ) : (
          <AiOutlinePlayCircle
            onClick={() => handleCollectionStatus(record)}
            style={{ fontSize: '17px' }}
          />
        )}

        <EyeOutlined
          onClick={() => {
            navigate(
              `/main_layout/uam_module/devices/devices/inventorydetail`,
              {
                state: {
                  data: record,
                },
              }
            );
          }}
          style={{ fontSize: '17px' }}
        />

        {record?.OnBoardingStatus === false && record?.messages !== null ? (
          <MdOutlineRestartAlt
            onClick={() => onBoard(record?.id)}
            style={{ fontSize: '17px' }}
          />
        ) : null}
        <Icon
          fontSize={'16px'}
          onClick={() => handleEdit(record)}
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

  const handleCollectionStatus = async (record) => {
    try {
      const response = await axiosInstance.post(
        `/sites/collection_status`,
        null,
        {
          params: {
            device_id: record.id,
            collecton_status: !record.collection_status,
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          showNotification({
            type: 'success',
            message: 'Collection status updated successfully.',
          })
        );
        fetchSeeds();
      } else {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Failed to update collection status.',
          })
        );
      }
    } catch (error) {
      console.error('Error fetching collection status:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'An error occurred while updating collection status.',
        })
      );
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const items = [
    {
      label: <a onClick={() => setOpenSeedModal(true)}>Add Manually</a>,
      key: '0',
    },
    {
      label: <a onClick={() => setOpenUpload(true)}>Import File</a>,
      key: '1',
    },
  ];

  const submitFile = async () => {
    if (!fileRef.current) {
      message.error('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileRef.current);

    try {
      setLoadingFile(true);
      const res = await axios.post(
        `${baseUrl}/sites/sites/upload_devices`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res?.status === 200) {
        setLoadingFile(false);
        setOpenUpload(false);
        setUploadedFile('');
        message.success('File submitted successfully.');
        fetchSeeds();
      }
    } catch (error) {
      console.error('File upload failed: ', error);
      message.error('File upload failed.');
      setLoadingFile(false);
    }
  };
  // ---------------
  const exportTemplate = (fileName) => {
    // Path to the file in the public directory
    const fileUrl = `${process.env.PUBLIC_URL}/templates/${fileName}`;
    saveAs(fileUrl, fileName); // Trigger file download
  };

  const handleSearch = (event) => {
    const { value } = event.target;

    if (value) {
      const filteredData = inventoryPageData?.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(inventoryPageData);
    }
  };

  const onboardedDevicesCount = inventoryPageData.filter(
    (device) => device.OnBoardingStatus === true
  ).length;
  console.log('onboardedDevicesCount::', onboardedDevicesCount);

  return (
    <div>
      {contextHolder}
      <StyledModal
        title="Limit Exceeded"
        open={isLimitModalVisible}
        // onOk={() => {
        //   setSelectedRowKeys([]);
        //   setIsLimitModalVisible(false);
        // }}
        onCancel={() => setIsLimitModalVisible(false)}
        centered
        theme={theme}
        footer={null}
      >
        <p>Devices limit exceeded. You can only onboard up to 50 devices.</p>
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            gap: '6px',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            danger
            type="primary"
            onClick={() => setIsLimitModalVisible(false)}
          >
            Close
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedRowKeys([]);
              setIsLimitModalVisible(false);
            }}
          >
            OK
          </Button>
        </div>
      </StyledModal>
      {/* {openSeedModal ? (
        <CustomModalSeeds
          handleClose={handleClose}
          open={openSeedModal}
          recordToEdit={recordToEdit}
          fetchSeeds={fetchSeeds}
        />
      ) : null} */}
      <CustomModal
        open={openSeedModal}
        title={`${recordToEdit ? 'Update Device' : 'Add Device'}`}
        addDevice="true"
      >
        <AddDeviceForm
          recordToEdit={recordToEdit}
          fetchSeeds={fetchSeeds}
          handleClose={handleClose}
          open={openSeedModal}
        />
      </CustomModal>

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

      <CustomModal
        open={openUpload}
        title="Upload File"
        onCancel={() => setOpenUpload(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '20px',
            }}
          >
            <Button
              style={{
                backgroundColor: '#e04136',
                borderColor: '#e04136',
                color: 'white',
              }}
              onClick={() => setOpenUpload(false)}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: theme?.palette?.main_layout?.secondary_text,
                borderColor: theme?.palette?.main_layout?.secondary_text,
                color: 'white',
              }}
              onClick={submitFile}
            >
              Submit
            </Button>
          </div>
        )}
        importFile={true}
      >
        <UploadFile
          loading={loadingFile}
          setUploadedFile={setUploadedFile}
          fileRef={fileRef}
        />
      </CustomModal>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: theme?.palette?.default_card?.background,
          color: theme?.palette?.main_layout?.primary_text,
          padding: '3px 10px',
          marginTop: '10px',
          width: '96%',
          margin: '0 auto',
        }}
      >
        <h3
          style={{
            color: theme?.palette?.main_layout?.primary_text,
            letterSpacing: '1px',
          }}
        >
          Devices
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
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
              : inventoryPageData
                ? inventoryPageData?.length
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
            marginBottom: '10px',
          }}
        >
          <CustomInput
            nested="true"
            style={{
              width: '300px',
            }}
            placeholder="Search..."
            onChange={handleSearch}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              // width: "40%",
              // marginLeft: "auto",
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
              onClick={() => exportTemplate('my-template.xlsx')}
            >
              <ExportOutlined />
              Export Template
            </Button>
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
              disabled={selectedRowKeys.length === 0}
              onClick={onBoard}
            >
              <FaArrowUp />
              On Board
            </Button>
            <ExportButton
              dataSource={
                filteredData?.length > 0
                  ? filteredData
                  : inventoryPageData
                    ? inventoryPageData
                    : []
              }
              columns={columns}
              name="Devices"
            />
            <CustomDropdown items={items} icon={<Icon icon="lucide:plus" />}>
              Add Device
            </CustomDropdown>
            {/* <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Button
                style={{
                  background: "#0490E7",
                  height: "33px",
                  color: "white",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  borderRadius: "4px",
                  borderColor: "#0490E7",
                }}
                // onClick={onAdd}
              >
                <Icon icon="lucide:plus" />
                Add Device
              </Button>
            </Dropdown> */}
          </div>
        </div>
        <CustomSpin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            columns={columns}
            dataSource={
              filteredData?.length > 0
                ? [...filteredData]
                : [...inventoryPageData]
            }
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            rowSelection={{
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, inventoryPageData?.length],
            }}
            scroll={{
              x: 1200,
            }}
          />
        </CustomSpin>
      </DefaultCard>
      {/* <Outlet /> */}
    </div>
  );
};

export default Devices;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
