import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables';
import { getTitle } from '../../../utils/helpers';
import CustomModal from './modal';
import { useNavigate } from 'react-router-dom';
import { deleteSiteAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice.js';
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
// import { Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// import { baseUrl } from "../../../utils/axios";
import { baseUrl, BaseUrl } from '../../../utils/axios';
import Swal from 'sweetalert2';
import {
  ExclamationCircleFilled,
  EyeOutlined,
  ImportOutlined,
  DeleteOutlined,
  ExportOutlined,
  RightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Modal, Tooltip, message } from 'antd';
import ViewSiteDetail from './viewSiteDetail';
// import { UseSelector } from "react-redux/es/hooks/useSelector";
import ExportButton from '../../../components/exportButton.jsx';

import CustomProgress from '../../../components/customProgress';
// ===============
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice.js';
import { render } from '@testing-library/react';
import CustomSearch from '../../../components/customSearch.jsx';
import { CustomInput } from '../../../components/customInput.jsx';
import { AppContext } from '../../../context/appContext.js';
import CustomSpin from '../../../components/CustomSpin.jsx';
const Index = () => {
  const role = localStorage.getItem('role');

  // theme
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { setMenuVisible } = useContext(AppContext);
  // hooks
  const { height, width } = useWindowDimensions();
  const [filteredData, setFilteredData] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();
  // refs
  const sites = useSelector((state) => state.sites);
  const access_token = localStorage.getItem('access_token');

  // states
  const conicColors = {
    '0%': '#3CB371', // Medium Sea Green, a brighter but not too bright green
    '50%': '#2b548f', // Medium Slate Blue, a brighter and lively blue
    '100%': '#c4101e', // Tomato, a vibrant yet not too harsh red
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataKeys, setDataKeys] = useState(dataKeysArray);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [ids, setIds] = useState([]);
  const [siteDetail, setSiteDetail] = useState();
  const { confirm } = Modal;
  const color = theme?.palette?.default_card?.background;
  useEffect(() => {
    setDataSource(sites?.sites);
  }, [sites]);

  const fetchSites = () => {
    dispatch(fetchsitesAsync());
  };
  useEffect(() => {
    fetchSites();
  }, [dispatch]);
  // mycode: Site table columns
  const columns = [
    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
      // ...getColumnSearchProps("site_name"),
      // sorter: (a, b) => a.site_name?.localeCompare(b.site_name),

      // for custom style
      render: (record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '10px',
          }}
        >
          {record}
        </div>
      ),

      onCell: (record) => ({
        onClick: () => {
          setMenuVisible((prev) => !prev);

          navigate(`sitedetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },
    {
      title: 'Site Type',
      dataIndex: 'site_type',
      key: 'site_type',
      // sorter: (a, b) => a.site_type?.localeCompare(b.site_type),

      // ...getColumnSearchProps("site_type"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
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
                  background: theme?.palette?.status?.background,
                  width: '59px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                  color: theme?.palette?.status?.color,
                  padding: '2px 5px',
                }}
              >
                {record}
              </div>
            ) : record == 'In Active' ? (
              <div
                style={{
                  background: '#D21E164A',
                  width: '59px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                  color: '#D21E16',
                  padding: '2px 5px',
                }}
              >
                {record}
              </div>
            ) : record == 'Maintainance' ? (
              <div
                style={{
                  background: '#FFC3004A',
                  color: '#FFC300',
                  width: '85px',
                  textAlign: 'center',
                  height: '18px',
                  borderRadius: '24px',
                  padding: '2px 5px',
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
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Country',
      dataIndex: 'region',
      key: 'region',
      // sorter: (a, b) => a.region?.localeCompare(b.region),

      // ...getColumnSearchProps("region"),
      render: (record) => {
        return (
          <>
            <div
              style={{
                color: theme?.palette?.default_table?.link_text,
              }}
            >
              {record}
            </div>
          </>
        );
      },
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      // sorter: (a, b) => a.city?.localeCompare(b.city),

      // ...getColumnSearchProps("city"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Total Racks',
      dataIndex: 'num_racks',
      key: 'num_racks',
      // sorter: (a, b) => a.num_racks?.localeCompare(b.num_racks),

      // ...getColumnSearchProps("num_racks"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Total Devices',
      dataIndex: 'num_devices',
      key: 'num_devices',
      // sorter: (a, b) => {
      //   const num_devicesA = String(a.num_devices);
      //   const num_devicesB = String(b.num_devices);
      //   return num_devicesA.localeCompare(num_devicesB);
      // },
      // ...getColumnSearchProps("num_devices"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      key: 'latitude',
      // sorter: (a, b) => a.latitude?.localeCompare(b.latitude),

      // ...getColumnSearchProps("latitude"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      // sorter: (a, b) => a.longitude?.localeCompare(b.longitude),

      // ...getColumnSearchProps("longitude"),
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Energy Efficiency',
      dataIndex: 'energy_efficiency',
      key: 'energy_efficiency',
      // sorter: (a, b) => {
      //   const powerUtilizationA = String(a.power_utilization);
      //   const powerUtilizationB = String(b.power_utilization);
      //   return powerUtilizationA.localeCompare(powerUtilizationB);
      // },

      // ...getColumnSearchProps("power_utilization"),
      render: (record) => (
        <Tooltip
          placement="left"
          color={color}
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
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    // {
    //   title: 'Power Utilization Efficiency',
    //   dataIndex: 'pue',
    //   key: 'pue',
    //   // sorter: (a, b) => {
    //   //   const pueA = String(a.pue);
    //   //   const pueB = String(b.pue);
    //   //   return pueA.localeCompare(pueB);
    //   // },
    //   // ...getColumnSearchProps("power_input"),
    //   render: (record) => (
    //     <Tooltip
    //       placement="left"
    //       color={color}
    //       overlayInnerStyle={{
    //         backgroundColor: theme?.palette?.graph?.toolTip_bg,
    //         color: theme?.palette?.main_layout?.primary_text,
    //       }}
    //       overlayStyle={{
    //         border: `1px solid ${theme?.palette?.default_card?.border}`,
    //       }}
    //       key={record?.id}
    //       title={
    //         record <= 50
    //           ? 'Lower PUE indicates better power utilization.'
    //           : record >= 85
    //             ? 'Higher PUE indicates worst power utilization.'
    //             : record < 85 || record > 50
    //               ? 'Average PUE indicates moderate power utilization.'
    //               : ''
    //       }
    //     >
    //       <div style={{ display: 'flex', justifyContent: 'center' }}>
    //         <CustomProgress
    //           percent={record}
    //           // type="circle"
    //           // strokeWidth="10"
    //           size={['90%', 12]}
    //           // size={[30]}
    //           conicColors={
    //             record > 50
    //               ? '#d91c07'
    //               : record > 50 && record < 85
    //                 ? '#0490E7'
    //                 : 'green'
    //           }
    //           table="true"
    //         />
    //       </div>
    //     </Tooltip>
    //   ),
    //   onCell: (record) => ({
    //     onClick: () => {
    //       navigate(`sitedetail`, {
    //         state: {
    //           data: record,
    //         },
    //       });
    //     },
    //   }),
    // },
    {
      title: 'Output Power (KW)',
      dataIndex: 'power_output',
      key: 'power_output',
      // sorter: (a, b) => {
      //   const power_inputA = String(a.power_input);
      //   const power_inputB = String(b.power_input);
      //   return power_inputA.localeCompare(power_inputB);
      // },
      // ...getColumnSearchProps("power_input"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Input Power (KW)',
      dataIndex: 'power_input',
      key: 'power_input',
      // sorter: (a, b) => {
      //   const power_inputA = String(a.power_input);
      //   const power_inputB = String(b.power_input);
      //   return power_inputA.localeCompare(power_inputB);
      // },
      // ...getColumnSearchProps("power_input"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },

    {
      title: 'CO2 Emmisions (Kg)',
      dataIndex: 'co2emmision',
      key: 'co2emmision',
      // sorter: (a, b) => {
      //   const power_inputA = String(a.power_input);
      //   const power_inputB = String(b.power_input);
      //   return power_inputA.localeCompare(power_inputB);
      // },
      // ...getColumnSearchProps("power_input"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Data Traffic (GB/s)',
      dataIndex: 'datatraffic',
      key: 'datatraffic',
      // sorter: (a, b) => {
      //   const datatrafficA = String(a.datatraffic);
      //   const datatrafficB = String(b.datatraffic);
      //   return datatrafficA.localeCompare(datatrafficB);
      // },

      // ...getColumnSearchProps("datatraffic"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Power Consumption Ratio (W/GBs)',
      dataIndex: 'pcr',
      key: 'pcr',
      // sorter: (a, b) => {
      //   const datatrafficA = String(a.datatraffic);
      //   const datatrafficB = String(b.datatraffic);
      //   return datatrafficA.localeCompare(datatrafficB);
      // },

      // ...getColumnSearchProps("datatraffic"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
    {
      title: 'Cost (AED)',
      dataIndex: 'site_cost',
      key: 'site_cost',
      // sorter: (a, b) => {
      //   const datatrafficA = String(a.datatraffic);
      //   const datatrafficB = String(b.datatraffic);
      //   return datatrafficA.localeCompare(datatrafficB);
      // },

      // ...getColumnSearchProps("datatraffic"),
      render: (record) => <p>{record} </p>,
      // onCell: (record) => ({
      //   onClick: () => {
      //     navigate(`sitedetail`, {
      //       state: {
      //         data: record,
      //       },
      //     });
      //   },
      // }),
    },
  ];
  // myCode:

  const handleDelete = async (id) => {
    // const response = await deleteSite(ids);

    // dispatch(deleteSiteAsync(id ? [id] : ids));

    try {
      const response = await axios.post(
        baseUrl + `/sites/deletesite`,
        id ? [id] : ids,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status == '200') {
        setIds([]);
        messageApi.open({
          type: 'success',
          content: 'Site deleted Successfully!',
        });
        // Swal.fire({
        //   title: "Site deleted Successfully",
        //   icon: "success",
        //   confirmButtonText: "OK",
        //   timer: 2000,
        //   timerProgressBar: true,
        //   customClass: {
        //     container: "custom-swal-container",
        //     title: "custom-swal-title",
        //     confirmButton: "custom-swal-button",
        //   },
        //   onClose: () => {},
        // });
        fetchSites();
      }
    } catch (error) {
      setIds([]);
      // messageApi.open({
      //   type: 'error',
      //   content: `This site can't be deleted as it is used in rack`,
      // });
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

  const handleChange = (pagination, filters, sorter, extra) => {};

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
          style: {
            backgroundColor: theme.palette?.drop_down_button?.add_background,
            color: 'white',
            borderRadius: '8px',
          },
          className: 'custom-ok-button',
        },
        cancelText: 'No',
        onOk() {
          handleDelete(id);
        },
        onCancel() {},
      });
    } else {
      Swal.fire({
        title: 'Select a site first',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal-container',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
        },
        onClose: () => {},
      });
    }
  };
  const viewDetails = (record) => {
    setSiteDetail(record);
    setOpen3(true);
  };
  if (role == 'true') {
    console.log('role:', role);

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
  } else {
    console.log('');
  }

  const handleClick = () => {
    setOpen(true);
  };

  // page header buttons
  const buttons = [
    {
      handleClick,
      type: 'Add Site',
      icon: <Icon icon="lucide:plus" />,
      style: {
        background: '#7A2731',
        height: '39px',
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
      // console.log("rows selected:", selectedRows);
      setSelectedRowsData(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      setIds((prevSiteId) => [...prevSiteId, record.id]);
    },
    onSelectAll: (record, selected, selectedRows) => {
      setIds(selected.map((item) => item.id));
    },
  };
  // Search function to filter data on each keystroke
  const handleSearch = (event) => {
    const { value } = event.target;

    if (value) {
      const filteredData = dataSource.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            // Exact match for 'status' field
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          // Partial match for other fields
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      // Reset to the full data source when input is cleared
      setFilteredData(dataSource);
    }
  };
  return (
    <div>
      {contextHolder}
      <CustomModal
        handleClose={handleClose}
        open={open}
        recordToEdit={recordToEdit}
        fetchSites={fetchSites}
      />

      <div
        style={{
          color: theme?.palette?.default_card?.color,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: theme?.palette?.default_card?.background,

          padding: '12px 0px 14px 15px',
          marginTop: '10px',
          width: '96.5%',
          margin: '0 auto',
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
      <DefaultCard sx={{ width: `${width - 120}px`, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {/* <CustomSearch
            width="300px"
            placeholder="Search for items"
            onChange={handleSearch}
          /> */}
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
              // width: "70%",
              // marginLeft: "auto",
              justifyContent: 'end',
              padding: '5px 0 10px 0',
            }}
          >
            {/* <PageHeader pageName="" buttons={buttons} /> */}
            {role == 'true' ? (
              <Button
                style={{
                  textTransform: 'capitalize',
                  fontWeight: '300px',
                  background: '#7A2731',
                  color: 'white',
                  borderRadius: '4px',
                  width: '100px',
                  height: '38px',
                  fontSize: '14px',
                  border: '1px solid #7A2731',
                }}
                onClick={() => showConfirm()}
              >
                <DeleteOutlined />
                <span style={{ fontWeight: 400 }}>Delete</span>
              </Button>
            ) : null}
            <ExportButton
              dataSource={
                selectedRowsData?.length > 0
                  ? selectedRowsData
                  : filteredData?.length > 0
                    ? filteredData
                    : dataSource
              }
              columns={columns}
              name="sites"
            />

            {role == 'true' ? (
              <Button
                style={{
                  textTransform: 'capitalize',
                  fontWeight: '300px',
                  backgroundColor:
                    theme?.palette?.drop_down_button?.add_background,
                  color: theme?.palette?.drop_down_button?.add_text,
                  borderRadius: '4px',
                  width: '100px',
                  height: '38px',
                  borderColor: theme?.palette?.drop_down_button?.border,
                }}
                onClick={handleClick}
              >
                <PlusOutlined />
                <span style={{ fontWeight: 400 }}>Add Site</span>
              </Button>
            ) : null}
          </div>
        </div>
        <CustomSpin spinning={sites.status === 'loading' ? true : false}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            columns={columns}
            dataSource={filteredData?.length > 0 ? filteredData : dataSource}
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
            scroll={{
              x: 3000,
            }}
          />
        </CustomSpin>
      </DefaultCard>
    </div>
    // </Spin>
  );
};

export default Index;
