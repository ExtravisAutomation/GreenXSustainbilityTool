import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DefaultCard from '../../../components/cards';
import { Icon } from '@iconify/react';
import DefaultTable from '../../../components/tables';
import CustomModalRacks from './modal';
import ExportButton from '../../../components/exportButton.jsx';
import { useNavigate } from 'react-router-dom';

import useWindowDimensions from '../../../hooks/useWindowDimensions';

import useColumnSearchProps from '../../../hooks/useColumnSearchProps';
import { Spin, Button, Modal, Tooltip, message } from 'antd';
import { dataKeysArray } from './constants';
import ViewRackDetail from './viewRackDetail';
import CustomProgress from '../../../components/customProgress';

import {
  ExclamationCircleFilled,
  RightOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import { fetchRacksAsync } from '../../../store/features/uamModule/racks/slices/racksSlice.js';
import { deleteRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput } from '../../../components/customInput.jsx';
import { AppContext } from '../../../context/appContext.js';
import CustomSpin from '../../../components/CustomSpin.jsx';

const conicColors = {
  '0%': '#3CB371', // Medium Sea Green, a brighter but not too bright green
  '50%': '#2b548f', // Medium Slate Blue, a brighter and lively blue
  '100%': '#c4101e', // Tomato, a vibrant yet not too harsh red
};

const Index = () => {
  const role = localStorage.getItem('role');
  const theme = useTheme();
  const isDarkMode = theme?.mode === 'dark';
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();
  // const [filteredData, setFilteredData] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const getColumnSearchProps = useColumnSearchProps();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [racksData, setRacksData] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [ids, setIds] = useState([]);
  const [rackDetail, setRackDetail] = useState();
  const dispatch = useDispatch();
  const racks = useSelector((state) => state.racks);

  const { confirm } = Modal;
  const color = '#36424e';
  const fetchRacks = () => {
    dispatch(fetchRacksAsync());
  };
  const [filteredData, setFilteredData] = useState([]);

  const { setMenuVisible } = useContext(AppContext);

  useEffect(() => {
    if (racks?.racks) {
      setFilteredData(racks.racks);
    }
  }, [racks.racks]);
  useEffect(() => {
    fetchRacks();
  }, []);

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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRowsData(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      setIds((prevRackId) => [...prevRackId, record.id]);
    },
    onSelectAll: (record, selected, selectedRows) => {
      setIds(selected.map((item) => item.id));
    },
  };
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRackAsync(id ? [id] : ids)); // ✅ Wait for deletion to complete

      messageApi.open({
        type: 'success',
        content: 'Rack deleted Successfully!',
      });

      setIds([]);
      setSelectedRowKeys([]);

      fetchRacks(); // ✅ Now it fetches the updated list
      console.log('deleted rack fetch');
    } catch (err) {
      console.log(err);

      messageApi.open({
        type: 'error',
        content: 'Failed to delete the rack',
      });

      setSelectedRowKeys([]);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     dispatch(deleteRackAsync(id ? [id] : ids));
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Rack deleted Successfully!',
  //     });
  //     // Swal.fire({
  //     //   title: "Rack deleted Successfully",
  //     //   icon: "success",
  //     //   confirmButtonText: "OK",
  //     //   timer: 2000,
  //     //   timerProgressBar: true,
  //     //   onClose: () => {},
  //     //   customClass: {
  //     //     container: "custom-swal-container",
  //     //     title: "custom-swal-title",
  //     //     confirmButton: "custom-swal-button",
  //     //   },
  //     // });
  //     setIds([]);
  //     setSelectedRowKeys([]);
  //     fetchRacks();
  //     console.log('delted rack fetch');
  //   } catch (err) {
  //     console.log(err);
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Failed to delete the rack',
  //     });
  //     // Swal.fire({
  //     //   title: "Failed to delete the rack",
  //     //   icon: "success",
  //     //   confirmButtonText: "OK",
  //     //   timer: 2000,
  //     //   timerProgressBar: true,
  //     //   onClose: () => {},
  //     // });
  //     setSelectedRowKeys([]);
  //   }
  // };

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
        title: 'Select a rack first',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: isDarkMode
            ? 'custom-swal-container-dark'
            : 'custom-swal-container-light',
          title: isDarkMode
            ? 'custom-swal-title-dark'
            : 'custom-swal-title-light',
          confirmButton: isDarkMode
            ? 'custom-swal-button-dark'
            : 'custom-swal-button-light',
        },
        onClose: () => {},
      });
    }
  };

  const columns = [
    {
      title: 'Rack Name',
      dataIndex: 'rack_name',
      key: 'rack_name',
      // sorter: (a, b) => a.rack_name?.localeCompare(b.rack_name),

      // ...getColumnSearchProps("rack_name"),
      onCell: (record) => ({
        onClick: () => {
          setMenuVisible((prev) => !prev);
          navigate(`rackdetail`, {
            state: {
              data: record,
            },
          });
        },
      }),
    },

    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
      // sorter: (a, b) => a.site_name?.localeCompare(b.site_name),

      // ...getColumnSearchProps("site_name"),
    },
    {
      title: 'Building Name',
      dataIndex: 'building_name',
      key: 'building_name',
    },
    {
      title: 'Rack Model',
      dataIndex: 'rack_model',
      key: 'rack_model',

      render: (record) => <div>{record == null ? '0' : record}</div>,
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
                  background: '#71B62633',
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
    },

    {
      title: 'Width',
      dataIndex: 'Width',
      key: 'Width',
      // sorter: (a, b) => {
      //   const WidthA = String(a.Width);
      //   const WidthB = String(b.Width);
      //   return WidthA.localeCompare(WidthB);
      // },

      // ...getColumnSearchProps("Width"),
    },
    {
      title: 'Height',
      dataIndex: 'Height',
      key: 'Height',
      // sorter: (a, b) => {
      //   const HeightA = String(a.Height);
      //   const HeightB = String(b.Height);
      //   return HeightA.localeCompare(HeightB);
      // },

      // ...getColumnSearchProps("Height"),
    },
    {
      title: 'Depth',
      dataIndex: 'Depth',
      key: 'Depth',
      // sorter: (a, b) => {
      //   const DepthA = String(a.Depth);
      //   const DepthB = String(b.Depth);
      //   return DepthA.localeCompare(DepthB);
      // },

      // ...getColumnSearchProps("Depth"),
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
    //       // color={color}
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
      title: 'Input Power',
      dataIndex: 'power_input',
      key: 'power_input',
      // sorter: (a, b) => {
      //   const power_inputA = String(a.power_input);
      //   const power_inputB = String(b.power_input);
      //   return power_inputA.localeCompare(power_inputB);
      // },
      // ...getColumnSearchProps("power_input"),
      render: (record) => <p>{record} KW</p>,
    },
    {
      title: 'Traffic Throughput',
      dataIndex: 'datatraffic',
      key: 'datatraffic',
      // sorter: (a, b) => {
      //   const datatrafficA = String(a.datatraffic);
      //   const datatrafficB = String(b.datatraffic);
      //   return datatrafficA.localeCompare(datatrafficB);
      // },
      // ...getColumnSearchProps("datatraffic"),
      render: (record) => <p>{record} Gb/s</p>,
    },

    // {
    //   title: "Traffic Throughput",
    //   dataIndex: "traffic_throughput",
    //   key: "traffic_throughput",
    // ...getColumnSearchProps("traffic_throughput"),
    // },
  ];

  if (role == 'true') {
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
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* <EyeOutlined
          onClick={() => viewDetails(record)}
          style={{ fontSize: "16px" }}
        /> */}
          <Icon
            style={{ fontSize: '16px' }}
            onClick={() => handleEdit(record)}
            icon="bx:edit"
          />
          <DeleteOutlined
            style={{ fontSize: '16px' }}
            onClick={() => showConfirm(record.id)}
          />
        </div>
      ),
    });
  } else {
    console.log('');
  }

  const handleSearch = (event) => {
    const { value } = event.target;

    if (value) {
      const filteredData = racks?.racks?.filter((item) =>
        Object.keys(item).some((key) => {
          if (key === 'status') {
            return String(item[key]).toLowerCase() === value.toLowerCase();
          }
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        })
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(racks?.racks);
    }
  };
  return (
    <div>
      {contextHolder}
      <CustomModalRacks
        handleClose={handleClose}
        open={open}
        recordToEdit={recordToEdit}
        fetchRacks={fetchRacks}
      />
      <Modal
        width="80%"
        open={open3}
        title={
          <h3 style={{ color: 'white', marginTop: '0px' }}>Rack Details</h3>
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
        <ViewRackDetail data={rackDetail} />
      </Modal>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px',
          color: theme?.palette?.default_card?.color,
          backgroundColor: theme?.palette?.default_card?.background,
          padding: '3px 10px',
          marginTop: '10px',
          width: '96%',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            color: theme?.palette?.main_layout?.primary_text,
            fontWeight: 500,
            fontSize: '18px',
          }}
        >
          Rack Details
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>Results</span>
          <span
            style={{
              width: '16px',
              height: '16px',
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
              : racks?.racks.length}
          </span>
        </div>
      </div>
      <DefaultCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
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
            <ExportButton
              dataSource={
                selectedRowsData?.length > 0
                  ? selectedRowsData
                  : filteredData?.length > 0
                    ? filteredData
                    : racks?.racks
              }
              columns={columns}
              name="racks"
            />
            {role == 'true' ? (
              <>
                <Button
                  style={{
                    height: '38px',
                    background: '#7A2731',
                    color: 'white',
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',

                    borderRadius: '4px',
                    border: 'none',
                  }}
                  onClick={() => showConfirm()}
                >
                  <Icon fontSize="16px" icon="mingcute:delete-line" />
                  Delete
                </Button>

                <Button
                  style={{
                    backgroundColor:
                      theme?.palette?.drop_down_button?.add_background,
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
                  Add Rack
                </Button>
              </>
            ) : null}
          </div>
        </div>
        <CustomSpin spinning={racks.status === 'loading' ? true : false}>
          <DefaultTable
            rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
            size="small"
            onChange={handleChange}
            rowSelection={rowSelection}
            columns={columns}
            // dataSource={filteredData}
            dataSource={filteredData?.length > 0 ? filteredData : racks?.racks}
            rowKey="id"
            style={{ whiteSpace: 'pre' }}
            pagination={{
              defaultPageSize: 9,
              pageSizeOptions: [10, 50, 100, racks?.racks.length],
            }}
            scroll={{
              x: 3800,
            }}
          />
        </CustomSpin>
      </DefaultCard>
    </div>
  );
};

export default Index;
const CustomCloseIcon = () => (
  <span style={{ color: 'red' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
