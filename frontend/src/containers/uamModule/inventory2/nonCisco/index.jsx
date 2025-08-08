import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
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
import { Spin, Button } from 'antd';
import useErrorHandling from '../../../../hooks/useErrorHandling.js';
import { dataKeysArray } from '../constants.js';
import PageHeader from '../../../../components/pageHeader.jsx';
import { Modal, Input, Form, message, Tooltip } from 'antd';
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
import { BaseUrl, baseUrl } from '../../../../utils/axios/index.js';
import axios from 'axios';
import SeedDetails from '../seedDetails.jsx';
import CustomProgress from '../../../../components/customProgress.jsx';
import CustomPagination from '../../../../components/customPagination.jsx';
import HorizontalMenu from '../../../../components/horizontalMenu.jsx';
import CustomSpin from '../../../../components/CustomSpin.jsx';
const conicColors = {
  '0%': '#3CB371', // Medium Sea Green, a brighter but not too bright green
  '50%': '#2b548f', // Medium Slate Blue, a brighter and lively blue
  '100%': '#c4101e', // Tomato, a vibrant yet not too harsh red
};
const NonCisco = () => {
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
  const [filteredData, setFilteredData] = useState([]);

  axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

  const { confirm } = Modal;
  const color = '#36424e';
  const fetchSeeds = async () => {
    const access_token = localStorage.getItem('access_token');

    setLoading(true);
    try {
      const response = await axios.post(
        baseUrl + '/device_inventory/get_all_device_inventory'
      );
      if (response) {
        setInventoryPageData(response?.data?.data);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    // console.log('Non Cisco Page');

    const access_token = localStorage.getItem('access_token');
    setAccessToken(access_token);
    // Issue in fetchApi
    // fetchSeeds();
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
      const res = await axios.post(BaseUrl + '/device_inventory/deletesite', [
        id,
      ]);
    } catch (error) {}
  };

  const handleEdit = (record) => {
    setRecordToEdit(record);
    setOpen(true);
  };

  const handleClose = () => {
    setRecordToEdit(null);
    setOpen(false);
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

  const columns = [
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: 'Device Type',
      dataIndex: 'device_type',
      key: 'device_type',
    },
    {
      title: 'Device Family',
      dataIndex: 'device_family',
      key: 'device_family',
    },
    {
      title: 'Model Name',
      dataIndex: 'model_name',
      key: 'model_name',
    },
    {
      title: 'Software Version',
      dataIndex: 'software_version',
      key: 'software_version',
    },

    {
      title: 'End of Life External Announcement',
      dataIndex: 'hw_eol_ad',
      key: 'hw_eol_ad',
    },
    {
      title: 'End of Sale',
      dataIndex: 'hw_eos',
      key: 'hw_eos',
    },
    {
      title: 'End of Software Maintenance Release',
      dataIndex: 'sw_EoSWM',
      key: 'sw_EoSWM',
    },
    {
      title: 'End of Routine Failure Analysis',
      dataIndex: 'hw_EoRFA',
      key: 'hw_EoRFA',
    },
    {
      title: 'End of Vulnerability/Security Support',
      dataIndex: 'sw_EoVSS',
      key: 'sw_EoVSS',
    },
    {
      title: 'End of Service Contract Renewal',
      dataIndex: 'hw_EoSCR',
      key: 'hw_EoSCR',
    },
    {
      title: 'Last Date of Support',
      dataIndex: 'hw_ldos',
      key: 'hw_ldos',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
  ];

  // columns.push({
  //   title: "Actions",
  //   dataIndex: "actions",
  //   key: "actions",
  //   fixed: "right",
  //   width: 100,
  //   render: (text, record) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         gap: "10px",
  //         justifyContent: "center",
  //       }}
  //     >
  //       {/* <EyeOutlined
  //         onClick={() => viewDetails(record)}
  //         style={{ fontSize: "17px" }}
  //       /> */}
  //       <Icon
  //         fontSize={"16px"}
  //         onClick={() => handleEdit(record)}
  //         icon="bx:edit"
  //       />
  //       <Icon
  //         onClick={() => showConfirm(record.id)}
  //         fontSize={"14px"}
  //         icon="uiw:delete"
  //       />
  //     </div>
  //   ),
  // });

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
            color: theme?.palette?.default_card?.color,
            backgroundColor: theme?.palette?.default_card?.background,
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
              backgroundColor: theme?.palette?.drop_down_button?.add_background,
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
          }}
        >
          <h3 style={{ color: 'white' }}>Device Details</h3>
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

            {/* <Button
              style={{
                background: "#0490E7",
                height: "33px",
                color: "white",
                textTransform: "capitalize",

                borderRadius: "4px",
                borderColor: "#0490E7",
                marginRight: "10px",
              }}
              onClick={() => setOpen(true)}
            >
              OnBoard Device
            </Button> */}
          </div>
        </div>
        <CustomSpin spinning={loading}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            columns={columns}
            dataSource={inventoryPageData}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 50, 100, inventoryPageData?.length],
            }}
            // onRow={(record) => ({
            //   onClick: () => {
            //     navigate(`inventorydetail`, {
            //       state: {
            //         data: record,
            //       },
            //     });
            //   },
            // })}
            scroll={{
              x: 3000,
            }}
          />
        </CustomSpin>
      </DefaultCard>
      {/* <Outlet /> */}
    </div>
  );
};

export default NonCisco;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
