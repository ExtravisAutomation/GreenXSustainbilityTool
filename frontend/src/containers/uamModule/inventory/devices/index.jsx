import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { Spin, Button, Card } from 'antd';
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
import { CustomInput } from '../../../../components/customInput.jsx';
import axiosInstance from '../../../../utils/axios/axiosInstance.js';
import InlineFilters from '../../../../components/ui/inlinefilters.js';
import { FEATURE_FLAGS } from '../../../../utils/featureFlags.js';
import { generateFltersList } from './filterConfig.js';
import { getDeviceInventory } from './services.js';
import { Label } from 'recharts';
import { formateOptions, formateOptionsWithId } from './utils.js';
import InventoryFilter, { scoreValues } from './inventoryFilter.jsx';
import { AppContext } from '../../../../context/appContext.js';
import { useLocation } from 'react-router-dom';
import { fetchDeviceInventory } from '../../../../services/devicesServices.js';
import CustomSpin from '../../../../components/CustomSpin.jsx';
const Index = () => {
  // theme
  const theme = useTheme();
  const navigate = useNavigate();
  const { setMenuVisible } = useContext(AppContext);
  const location = useLocation();

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
  const [loading, setLoading] = useState(false);
  const [inventoryPageData, setInventoryPageData] = useState([]);
  const [seedDetail, setSeedDetail] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  // const [excellentDevicesCount, setExcellentDevicesCount] = useState(0);
  const activefilters = useRef(null);

  const { confirm } = Modal;
  const color = '#36424e';

  const fetchSeeds = async (page = 1, payload = null) => {
    if (payload !== null) {
      if (payload.score) payload.score = scoreValues[payload.score];
      activefilters.current = payload;
    } else if (payload === null && activefilters.current !== null) {
      payload = activefilters.current;
    }

    payload = { page, ...payload };

    setLoading(true);
    try {
      const data = await fetchDeviceInventory({ page, payload });
      setInventoryPageData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dashParent = location.state?.parent;
    // console.log('Dashboard parent:::::::::', dashParent);
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
      const res = await axiosInstance.post('/device_inventory/deletesite', [
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
      okText: 'yes',
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

  // console.log('mycode::::: devices details', inventoryPageData);

  const columns = [
    {
      title: 'Device IP',
      dataIndex: 'device_ip',
      key: 'device_ip',
      // mycode:: click disable
      onCell: (record) => ({
        onClick: () => {
          setMenuVisible((prev) => !prev);
          navigate(`inventorydetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
      render: (text, record) => {
        return (
          <span
            style={{
              color: theme?.palette?.main_layout?.secondary_text,
              fontWeight: 500,
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: 'Device Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },

    {
      title: 'Device Type',
      dataIndex: 'device_type',
      key: 'device_type',
      // sorter: (a, b) => a.device_type?.localeCompare(b.device_type),
      // ...getColumnSearchProps("device_type"),
    },
    {
      title: 'Serial Number',
      dataIndex: 'serial_number',
      key: 'serial_number',
      // sorter: (a, b) => a.serial_number?.localeCompare(b.serial_number),

      // ...getColumnSearchProps("serial_number"),
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
    // {
    //   title: 'Department',
    //   dataIndex: 'department',
    //   key: 'department',
    //   // sorter: (a, b) => a.department?.localeCompare(b.department),
    //   // ...getColumnSearchProps("department"),
    // },

    {
      title: 'Model Number',
      dataIndex: 'pn_code',
      key: 'pn_code',
      // sorter: (a, b) => a.pn_code?.localeCompare(b.pn_code),

      // ...getColumnSearchProps("pn_code"),
    },
    // {
    //   title: 'Criticality',
    //   dataIndex: 'criticality',
    //   key: 'criticality',
    //   // sorter: (a, b) => a.criticality?.localeCompare(b.criticality),

    //   // ...getColumnSearchProps("criticality"),
    // },

    {
      title: 'Hardware Version',
      dataIndex: 'hardware_version',
      key: 'hardware_version',
      // sorter: (a, b) => a.hardware_version?.localeCompare(b.hardware_version),

      // ...getColumnSearchProps("hardware_version"),
    },
    {
      title: 'Software Version',
      dataIndex: 'software_version',
      key: 'software_version',
      // sorter: (a, b) => a.software_version?.localeCompare(b.software_version),

      // ...getColumnSearchProps("software_version"),
    },

    {
      title: 'End of Life External Announcement',
      dataIndex: 'hw_eol_ad',
      key: 'hw_eol_ad',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_eol_ad?.localeCompare(b.hw_eol_ad),

      // ...getColumnSearchProps("hw_eol_ad"),
    },
    {
      title: 'End of Sale',
      dataIndex: 'hw_eos',
      key: 'hw_eos',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_eos?.localeCompare(b.hw_eos),

      // ...getColumnSearchProps("hw_eos"),
    },
    {
      title: 'End of Software Maintenance Release',
      dataIndex: 'sw_EoSWM',
      key: 'sw_EoSWM',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.sw_EoSWM?.localeCompare(b.sw_EoSWM),

      // ...getColumnSearchProps("sw_EoSWM"),
    },
    {
      title: 'End of Routine Failure Analysis',
      dataIndex: 'hw_EoRFA',
      key: 'hw_EoRFA',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_EoRFA?.localeCompare(b.hw_EoRFA),

      // ...getColumnSearchProps("hw_EoRFA"),
    },
    {
      title: 'End of Vulnerability/Security Support',
      dataIndex: 'sw_EoVSS',
      key: 'sw_EoVSS',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.sw_EoVSS?.localeCompare(b.sw_EoVSS),

      // ...getColumnSearchProps("sw_EoVSS"),
    },
    {
      title: 'End of Service Contract Renewal',
      dataIndex: 'hw_EoSCR',
      key: 'hw_EoSCR',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_EoSCR?.localeCompare(b.hw_EoSCR),

      // ...getColumnSearchProps("hw_EoSCR"),
    },
    {
      title: 'Last Date of Support',
      dataIndex: 'hw_ldos',
      key: 'hw_ldos',
      //   render: (text) => formatDateTime(text),
      // sorter: (a, b) => a.hw_ldos?.localeCompare(b.hw_ldos),

      // ...getColumnSearchProps("hw_ldos"),
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      // sorter: (a, b) => a.manufacturer?.localeCompare(b.manufacturer),

      // ...getColumnSearchProps("manufacturer"),
    },
    // {
    //   title: "Onboarding Date",
    //   dataIndex: "creation_date",
    //   key: "creation_date",
    // },
    // {
    //   title: 'Section',
    //   dataIndex: 'section',
    //   key: 'section',
    //   // sorter: (a, b) => a.section?.localeCompare(b.section),

    //   // ...getColumnSearchProps("section"),
    // },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      // sorter: (a, b) => a.status?.localeCompare(b.status),

      // ...getColumnSearchProps("status"),

      render: (record) => {
        return (
          <div>
            {record == 'Active' ? (
              <div
                style={{
                  background: '#71B62633',
                  width: '59px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                  color: theme?.palette?.status?.color,
                }}
              >
                {record}
              </div>
            ) : record == 'In Active' ? (
              <div
                style={{
                  background: '#d87053',
                  width: '59px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                  color: 'white',
                }}
              >
                {record}
              </div>
            ) : (
              <div
                style={{
                  // background: "#71B62633",
                  color: '#C8FF8C',
                  width: '85px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                }}
              >
                {record}
              </div>
            )}
          </div>
        );
      },
    },

    {
      title: 'Energy Efficiency',
      dataIndex: 'power_utilization',
      key: 'power_utilization',
      // sorter: (a, b) => {
      //   const powerUtilizationA = String(a.power_utilization);
      //   const powerUtilizationB = String(b.power_utilization);
      //   return powerUtilizationA.localeCompare(powerUtilizationB);
      // },

      // ...getColumnSearchProps("power_utilization"),
      render: (record) => (
        <Tooltip
          placement="left"
          // color={color}
          overlayInnerStyle={{
            backgroundColor: theme?.palette?.graph?.toolTip_bg,
            color: theme?.palette?.main_layout?.primary_text,
          }}
          overlayStyle={{
            border: `1px solid ${theme?.palette?.default_card?.border}`,
          }}
          key={record?.id}
          title={
            record <= 50
              ? 'Low EER values indicate poor efficiency.'
              : record >= 85
                ? 'High EER values signify excellent efficiency.'
                : record < 85 || record > 50
                  ? 'Average EER values suggest moderate efficiency.'
                  : ''
          }
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomProgress
              percent={record}
              // type="circle"
              // strokeWidth="10"
              size={['90%', 12]}
              // size={[30]}
              conicColors={
                record < 50
                  ? '#d91c07'
                  : record > 50 && record < 85
                    ? '#0490E7'
                    : 'green'
              }
              table="true"
            />
          </div>
        </Tooltip>
      ),
    },
    // {
    //   title: 'Power Usage Effectiveness',
    //   dataIndex: 'pue',
    //   key: 'pue',
    //   // sorter: (a, b) => {
    //   //   const pueA = String(a.pue);
    //   //   const pueB = String(b.pue);
    //   //   return pueA.localeCompare(pueB);
    //   // },
    //   // ...getColumnSearchProps("power_input"),
    // },
    {
      title: 'Stack',
      dataIndex: 'stack',
      key: 'stack',

      // render: (record) => <p>{record} Gb/s</p>,
    },
    {
      title: 'Total Power Capacity',
      dataIndex: 'total_power_capacity',
      key: 'total_power_capacity',

      // render: (record) => <p>{record} Gb/s</p>,
    },
    {
      title: 'Power Supply Count',
      dataIndex: 'psu_count',
      key: 'psu_count',

      // render: (record) => <p>{record} Gb/s</p>,
    },
    {
      title: 'Power Supply Model',
      dataIndex: 'psu_model',
      key: 'psu_model',

      // render: (record) => <p>{record} Gb/s</p>,
    },
    {
      title: 'Output Power (W)',
      dataIndex: 'power_output',
      key: 'power_output',

      render: (record) => <p>{Math.round(record)}</p>,
    },
    {
      title: 'Input Power (W)',
      dataIndex: 'power_input',
      key: 'power_input',

      render: (record) => <p>{Math.round(record)} </p>,
    },

    // carbon-emmison
    {
      title: 'Carbon Emission (Kg)',
      dataIndex: 'carbon-emmison',
      key: 'carbon-emmison',

      render: (record) => <p>{Math.round(record)} </p>,
    },
    {
      title: 'Traffic Throughput (MB/s)',
      dataIndex: 'datatraffic',
      key: 'datatraffic',
      // sorter: (a, b) => {
      //   const datatrafficA = String(a.power_utilization);
      //   const datatrafficB = String(b.power_utilization);
      //   return datatrafficA.localeCompare(datatrafficB);
      // },
      // ...getColumnSearchProps("datatraffic"),
      render: (record) => <p>{record} </p>,
    },
    // bandwidth_utilization
    // {
    //   title: 'Bandwidth Utilization',
    //   dataIndex: 'bandwidth_utilization',
    //   key: 'bandwidth_utilization',

    //   render: (record) => <p>{Math.round(record)} Gb/s</p>,
    // },
    {
      title: 'Performance Score',
      dataIndex: 'score_num',
      key: 'score_num',
    },
    {
      title: 'Performance Description',
      dataIndex: 'score_desc',
      key: 'score_desc',
    },
  ];

  // filter for performance based count:

  const excellentCount = inventoryPageData?.devices?.filter(
    (item) => item.power_utilization >= 85
  );

  const normalCount = inventoryPageData?.devices?.filter(
    (item) => item.power_utilization >= 50 && item.power_utilization < 85
  );

  const criticalCount = inventoryPageData?.devices?.filter(
    (item) => item.power_utilization < 50
  );
  // console.log('all devices::', inventoryPageData);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRowsData(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (record, selected, selectedRows) => {},
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

  const handlePaginationChange = (page, pageSize) => {
    fetchSeeds(page);
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: theme?.palette?.default_card?.color,
          backgroundColor: theme?.palette?.default_card?.background,
          width: '95.5%',
          padding: '4px 15px',
          margin: '0 auto',
          borderRadius: '6px',
        }}
      >
        <p
          style={{
            fontWeight: 500,
            color: theme?.palette?.main_layout?.primary_text,
          }}
        >
          Devices Detail
        </p>
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
              // color: theme?.palette?.default_card?.color,
              // backgroundColor: theme?.palette?.default_card?.background,
              // padding: "12px 0px 14px 15px",
              marginTop: '10px',
              // width: "96.5%",
              // margin: "0 auto",
            }}
          >
            <span>Resultes</span>
            <span
              style={{
                width: '27px',
                height: '27px',
                borderRadius: '100%',
                backgroundColor:
                  theme?.palette?.drop_down_button?.add_background,
                color: theme?.palette?.drop_down_button?.add_text,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
              }}
            >
              {inventoryPageData?.total_devices}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          // color: theme?.palette?.default_card?.color,
          // backgroundColor: theme?.palette?.default_card?.background,
          width: '97.5%',
          padding: '4px 20px',
          margin: '10px 0px',
          borderRadius: '6px',
        }}
      >
        <Card
          style={{
            borderRadius: '6px',
            backgroundColor: theme?.palette?.default_card?.background,
            border: `1px solid ${theme?.palette?.default_card?.border}`,

            color: '#4C791B',
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', color: '#4C791B' }}>
            {excellentCount?.length}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            Excellent Devices
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '6px',
            backgroundColor: theme?.palette?.default_card?.background,
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            width: '100%',
            color: '#6568Ed',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', color: '#6568Ed' }}>
            {normalCount?.length}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            Normal Devices
          </div>
        </Card>
        <Card
          style={{
            borderRadius: '6px',
            backgroundColor: theme?.palette?.default_card?.background,
            border: `1px solid ${theme?.palette?.default_card?.border}`,
            color: '#fb0200',
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', color: '#fb0200' }}>
            {criticalCount?.length}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            Critical Devices
          </div>
        </Card>
        {/* <div>{excellentCount?.length}</div> */}
      </div>
      <DefaultCard sx={{ width: `${width - 105}px` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* <CustomInput
            nested="true"
            style={{
              width: '300px',
            }}
            placeholder="Search..."
            onChange={handleSearch}
          /> */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',

              justifyContent: 'end',
            }}
          >
            {FEATURE_FLAGS.Inventory_Filter ? (
              <InventoryFilter fetchSeeds={fetchSeeds} columns={columns} />
            ) : (
              <ExportButton
                dataSource={
                  selectedRowsData?.length > 0
                    ? selectedRowsData
                    : inventoryPageData?.devices || []
                }
                columns={columns}
                name="Devices"
              />
            )}
          </div>
        </div>
        <CustomSpin spinning={loading}>
          <DefaultTable
            key="inventory-devices"
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            columns={columns}
            dataSource={inventoryPageData?.devices}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 10,
              // pageSizeOptions: [10, 50, 100, inventoryPageData?.length],
              showSizeChanger: false,
              onChange: handlePaginationChange,
              total: inventoryPageData?.total_devices,
            }}
            rowSelection={rowSelection}
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
              x: 4500,
            }}
          />
        </CustomSpin>
      </DefaultCard>
      {/* <Outlet /> */}
    </div>
  );
};

export default Index;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
