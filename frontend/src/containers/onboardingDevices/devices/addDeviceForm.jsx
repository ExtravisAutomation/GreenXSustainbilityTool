import React, { useCallback, useEffect, useState } from 'react';
import CustomForm from '../../../components/customForm';
// import CustomFormRacks from "./form";
import { Icon } from '@iconify/react';
import axios from 'axios';
import styled from 'styled-components';

import { baseUrl } from '../../../utils/axios';
import Swal from 'sweetalert2';
import {
  Modal,
  Button,
  Form,
  Select,
  Row,
  Col,
  Input,
  message,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { BaseUrl } from '../../../utils/axios';
// import { selectTableData as selectSitesTableData } from "../../../store/features/uamModule/sites/selectors";
import { selectTableData as selectRacksTableData } from '../../../store/features/uamModule/racks/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchRecordsQuery as usefetchRacksQuery } from '../../../store/features/uamModule/racks/apis';
// import { useFetchRecordsQuery as usefetchSitesQuery } from "../../../store/features/uamModule/sites/apis";
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { fetchRacksAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { CustomInput } from '../../../components/customInput';
import { Validator } from '../../../components/validator';
import { createSiteAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { createRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { integerValidator } from '../../../components/validator';
import { useTheme } from '@mui/material/styles';
import DefaultSelector from '../../../components/defaultSelector';
import CustomModal from '../../../components/customModal';
import AddSiteForm from './addSiteForm';
import AddRackForm from './addRackForm';
import { formateOptionsWithId } from '../../uamModule/inventory/devices/utils';
import {
  getDviceTypes,
  getRacksBySiteId,
} from '../../uamModule/inventory/devices/services';
import axiosInstance from '../../../utils/axios/axiosInstance';
import { fetchDeviceTypes } from '../../../services/devicesServices';
import {
  fetchAllPasswordGroups,
  fetchAllVendors,
  fetchRacksBySiteId,
  fetchSiteNames,
} from '../../../services/services';
import {
  addOnboardDevice,
  createDeviceType,
  createVendor,
  updateOnboardDevice,
} from '../../../services/onBoardingModule/onBoardingDeviceServices';

const access_token = localStorage.getItem('access_token');

const AddDeviceForm = ({ handleClose, open, recordToEdit, fetchSeeds }) => {
  const dispatch = useDispatch();
  // const theme = useTheme();
  console.log('updateDevice:::', recordToEdit);

  const theme = useTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const StyledForm = styled(Form)`
    margin: 10px !important;
    .ant-form-item-label > label {
      color: #e5e5e5;
    }
  `;
  const StyledModal = styled(Modal)`
    .ant-modal-header {
      background-color: ${theme?.palette?.drop_down_button
        ?.add_background} !important;
      padding: 10px 10px 15px 20px;
      margin-bottom: 20px;
    }

    .ant-modal-title {
      color: #e5e5e5;
      margin-top: 5px !important;
    }
    .ant-modal-content {
      background-color: ${theme?.palette?.default_card?.background} !important;
      border-radius: 10px !important;
      border: 1px solid ${theme?.palette?.default_card?.border} !important;
      padding: 0px 0px 5px 0px !important;
    }
  `;
  const handleOk = async (values) => {};

  const [deviceFrom] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');

  const access_token = localStorage.getItem('access_token');
  // console.log(access_token, "access token");
  const [racks, setRacks] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loaders
  const [vendorChangeLodaer, setVendorChangeLoader] = useState(false);
  const [siteChangeLodaer, setSiteChangeLoader] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedRackId, setSelectedRackId] = useState(null);
  const [passwordGroup, setPasswordGroup] = useState();
  const [selectedPasswordGroupId, setSelectedPasswordGroupId] = useState(null);
  const [sites, setSites] = useState();
  const [vendors, setVendors] = useState([]);
  const [openAddSiteModal, setOpenAddSiteModal] = useState(false);
  const [openAddRackModal, setOpenAddRackModal] = useState(false);
  const [openVendorModal, setOpenVendorModal] = useState(false);
  const [openDeviceTypeModal, setOpenDeviceTypeModal] = useState(false);

  const handleOpenVendorModal = useCallback(() => {
    setOpenVendorModal(true);
  }, []);

  const handleCloseVendorModal = useCallback(() => {
    setOpenVendorModal(false);
  }, []);

  const handleOpenDeviceTypeModal = useCallback(() => {
    setOpenDeviceTypeModal(true);
  }, []);

  const handleCloseDeviceTypeModal = useCallback(() => {
    setOpenDeviceTypeModal(false);
  }, []);

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;

  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 14,
            offset: 4,
          },
        }
      : null;

  const getVendors = async () => {
    try {
      const vendorData = await fetchAllVendors();
      setVendors(formateOptionsWithId(vendorData?.data?.data, 'vendor_name'));
      // console.log('Vendors in Component', vendorData?.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  // Api Service to get all password Groups from backend
  const getPasswordGroups = async () => {
    try {
      const res = await fetchAllPasswordGroups();
      // console.log('password group called', res?.data?.data);
      setPasswordGroup(
        formateOptionsWithId(res?.data?.data, 'password_group_name')
      );
    } catch (error) {
      console.error('Failed to fetch password groups:', error);
    }
  };

  const getDeviceTypes = async (payload) => {
    try {
      const deviceTypes = await fetchDeviceTypes(payload);
      // console.log('device type res', deviceTypes);
      setDeviceTypes(
        formateOptionsWithId(
          deviceTypes?.data?.device_type_count,
          'device_type',
          'device_type_id'
        )
      );
    } catch (error) {}
  };

  const siteNames = async () => {
    try {
      const sitesss = await fetchSiteNames();
      // console.log('sitesss in component', sitesss);

      setSites(
        sitesss?.map((item) => {
          return {
            label: item?.site_name,
            value: item?.id,
          };
        })
      );
    } catch (error) {
      console.log('hamara error', error);
    }
  };
  // console.log('sites ::::::::', sites);

  // useEffect(() => {
  //   siteNames();
  // }, []);

  // const addDevice = async (values) => {
  //   // console.log(values, "racke form values");
  //   setLoading(true);
  //   try {
  //     if (recordToEdit) {
  //       const res = await axiosInstance.post(
  //         baseUrl + `/sites/sites/update_device/${recordToEdit?.id}`,
  //         values
  //       );
  //       if (res?.status == '200') {
  //         setLoading(false);
  //         messageApi.open({
  //           type: 'success',
  //           content: res.data.message,
  //         });
  //         setTimeout(() => {
  //           fetchSeeds();
  //           handleClose();
  //         }, 1000);
  //       }
  //     } else {
  //       const res = await axiosInstance.post(
  //         baseUrl + '/sites/sites/create_onboard_devices',
  //         values
  //       );
  //       if (res?.status == '200') {
  //         setLoading(false);
  //         messageApi.open({
  //           type: 'success',
  //           content: res.data.message,
  //         });
  //         setTimeout(() => {
  //           fetchSeeds();
  //           handleClose();
  //         }, 1000);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error, 'errororororor');
  //     setLoading(false);
  //   }
  // };

  // through api service
  const addDevice = async (values) => {
    setLoading(true);
    try {
      let res;
      if (recordToEdit) {
        res = await updateOnboardDevice(recordToEdit?.id, values);
      } else {
        res = await addOnboardDevice(values);
      }

      if (res?.status === 200 || res?.status === '200') {
        messageApi.open({
          type: 'success',
          content: res.data.message,
        });

        setTimeout(() => {
          fetchSeeds();
          handleClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Device API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVendor = async (value) => {
    deviceFrom.setFieldValue({ device_type: null });
    if (value) {
      setVendorChangeLoader(true);
      try {
        await getDeviceTypes({ vendor_id: value });
      } catch (error) {
        console.error('Error fetching device types:', error);
      } finally {
        setVendorChangeLoader(false);
      }
    } else {
      setDeviceTypes([]);
    }
  };

  const onSiteChange = async (value) => {
    if (value) {
      setSiteChangeLoader(true);
      try {
        deviceFrom.setFieldsValue({ rack_id: null });
        const racksData = await fetchRacksBySiteId(value);
        setRacks(formateOptionsWithId(racksData?.data?.data, 'rack_name'));
      } catch (error) {
        console.error('Error fetching racks:', error);
      } finally {
        setSiteChangeLoader(false);
      }
    } else {
      setRacks([]);
    }
  };

  const handleChange2 = (value, option) => {
    setSelectedRackId(value);
  };

  const handleChange3 = (value, option) => {
    console.log('Selected Password Group IDD:', value);
    setSelectedPasswordGroupId(value);
  };

  const formItemsConfig = [
    {
      label: 'Device IP',
      name: 'ip_address',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter device IP' },
        { pattern: /^[0-9.]+$/, message: "Only numbers and '.' are allowed" },
      ],
      props: {
        placeholder: 'Enter Device IP',
      },
    },
    {
      label: 'Vendor',
      name: 'vendor_id',
      type: 'select',
      rules: [{ required: true, message: 'Please enter Device type' }],
      props: {
        options: vendors,
        onChange: handleChangeVendor,
        addDevice: 'true',
      },
      button: {
        onClick: () => handleOpenVendorModal(),
      },
    },
    {
      label: 'Device Type',
      name: 'device_type',
      type: 'select',
      props: {
        options: deviceTypes,
        addDevice: 'true',
        loader: vendorChangeLodaer,
      },
      button: {
        onClick: () => handleOpenDeviceTypeModal(),
      },
    },
    {
      label: 'Sites',
      name: 'site_id',
      type: 'select',
      rules: [{ required: true, message: 'Please select a site' }],
      props: {
        options: sites,
        onChange: onSiteChange,
        addDevice: 'true',
      },
      button: {
        onClick: () => setOpenAddSiteModal(true),
      },
    },
    {
      label: 'Racks',
      name: 'rack_id',
      type: 'select',
      rules: [{ required: true, message: 'Please select a rack' }],
      props: {
        options: racks,
        onChange: handleChange2,
        value: selectedRackId,
        addDevice: 'true',
        loader: siteChangeLodaer,
      },
      button: {
        onClick: () => setOpenAddRackModal(true),
      },
    },
    {
      label: 'Password Group',
      name: 'password_group_id',
      type: 'select',
      rules: [{ required: true, message: 'Please enter status' }],
      props: {
        options: passwordGroup,
        onChange: handleChange3,
        raks: 'true',
        value: selectedPasswordGroupId,
      },
    },
  ];

  const renderComponent = (type, props) => {
    switch (type) {
      case 'input':
        return <CustomInput {...props} />;
      case 'select':
        return <DefaultSelector {...props} />;
      default:
        return null;
    }
  };

  const handleDeviceTypeCreationSuccess = () => {
    const vendorId = deviceFrom.getFieldValue('vendor_id');
    getDeviceTypes({ vendor_id: vendorId });
  };

  useEffect(() => {
    if (recordToEdit) {
      const updateDate =
        recordToEdit.manufacture_date === ''
          ? ''
          : moment(recordToEdit.manufacture_date);
      deviceFrom.setFieldsValue({
        ...recordToEdit,
        manufacture_date: updateDate,
      });
    }
  }, [recordToEdit, deviceFrom]);

  useEffect(() => {
    dispatch(fetchsitesAsync());
  }, [dispatch]);

  useEffect(() => {
    getPasswordGroups();
    getVendors();
    siteNames();
  }, [open]);

  return (
    <>
      <CustomModal open={openAddSiteModal} title="Add Site">
        <AddSiteForm
          siteNames={siteNames}
          handleClose={() => setOpenAddSiteModal(false)}
        />
      </CustomModal>
      <CustomModal open={openAddRackModal} title="Add Rack">
        <AddRackForm
          // fetchRacksById={fetchRacksById}
          handleClose={() => setOpenAddRackModal(false)}
          onSiteChange={onSiteChange}
        />
      </CustomModal>
      <CreateVendorModal
        open={openVendorModal}
        onClose={handleCloseVendorModal}
        onSuccess={getVendors}
      />
      <CreateDeviceTypeModal
        open={openDeviceTypeModal}
        vendors={vendors}
        onClose={handleCloseDeviceTypeModal}
        onSuccess={handleDeviceTypeCreationSuccess}
      />
      <Spin spinning={loading}>
        <StyledForm
          {...formItemLayout}
          layout={formLayout}
          form={deviceFrom}
          name="deviceFrom"
          onFinish={addDevice}
          initialValues={{
            layout: formLayout,
          }}
        >
          <Row>
            {formItemsConfig.map((item, index) => (
              <Col key={index} xs={24} lg={12} style={{ padding: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Form.Item
                    label={
                      <p style={{ color: 'gray', marginBottom: '0px' }}>
                        {item.label}
                      </p>
                    }
                    name={item.name}
                    rules={item.rules}
                  >
                    {renderComponent(item.type, item.props)}
                  </Form.Item>
                  {item.button && (
                    <Button
                      size="large"
                      onClick={item.button.onClick}
                      style={{
                        background: 'transparent',
                        borderColor: theme?.palette?.default_card?.border,
                        borderLeft: 'none',
                        color: '#e5e5e5',
                        borderRadius: '0 5px 5px 0',
                        position: 'absolute',
                        top: '44px',
                        right: '0',
                        height: '42px',
                      }}
                    >
                      +
                    </Button>
                  )}
                </div>
              </Col>
            ))}
          </Row>

          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            {...buttonItemLayout}
          >
            <Button
              onClick={() => {
                handleClose();
                deviceFrom.resetFields();
              }}
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
                backgroundColor:
                  theme?.palette?.drop_down_button?.add_background,
                color: theme?.palette?.drop_down_button?.add_text,
                borderRadius: '5px',
              }}
              type="primary"
              htmlType="submit"
            >
              {recordToEdit ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </StyledForm>
      </Spin>
    </>
  );
};

export default AddDeviceForm;

const CreateVendorModal = ({ open, onClose, onSuccess = () => {} }) => {
  const [vendorName, setVendorName] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const handleVendorNameChange = (e) => {
    setVendorName(e.target.value);
  };

  const handleSubmit = async () => {
    if (!vendorName) {
      message.error('Vendor name is required');
      return;
    }

    setLoading(true);
    const payload = { vendor_name: vendorName };
    try {
      const response = await createVendor(payload);

      if (response?.status_code === 200) {
        message.success(response?.message);
        onSuccess();
        onClose();
      } else {
        message.error('Failed to create vendor');
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      message.error('An error occurred while creating the vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title="Create Vendor"
      open={open}
      // onCancel={onClose}
      width="600px"
      afterClose={() => setVendorName('')}
    >
      <CustomInput
        placeholder="Enter vendor name"
        value={vendorName}
        onChange={handleVendorNameChange}
      />
      <div
        style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
      >
        <Button
          onClick={onClose}
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
            // backgroundColor: '#0490e7',
            // borderColor: '#0490e7',
            backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
            borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
            color: '#e5e5e5',
            borderRadius: '5px',
          }}
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </CustomModal>
  );
};

const CreateDeviceTypeModal = ({
  open,
  onClose,
  vendors = [],
  onSuccess = () => {},
}) => {
  const [deviceType, setDeviceType] = useState('');
  const [vendor, setVendor] = useState(
    vendors.length > 0 ? vendors[0]?.value : null
  );
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const handleDeviceTypeChange = (e) => {
    setDeviceType(e.target.value);
  };

  const handleVendorChange = (value) => {
    setVendor(value);
  };

  const handleSubmit = async () => {
    if (!deviceType) {
      message.error('Vendor name is required');
      return;
    }

    setLoading(true);
    const payload = { device_type: deviceType, vendor_id: vendor };
    try {
      const response = await createDeviceType(payload);

      if (response.status_code === 200) {
        message.success(response?.message);
        onSuccess();
        onClose();
      } else {
        message.error('Failed to create vendor');
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      message.error('An error occurred while creating the vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title="Create Device Type"
      open={open}
      onCancel={onClose}
      width="600px"
      afterClose={() => setDeviceType('')}
    >
      <DefaultSelector
        options={vendors}
        onChange={handleVendorChange}
        value={vendor}
        width="100%"
        placeholder="Select Vendor"
        margin="15px 0"
      />
      <CustomInput
        placeholder="Enter type name"
        value={deviceType}
        onChange={handleDeviceTypeChange}
      />
      <div
        style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}
      >
        <Button
          onClick={onClose}
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
          // style={{
          //   backgroundColor: '#0490e7',
          //   borderColor: '#0490e7',
          //   color: '#e5e5e5',
          //   borderRadius: '5px',
          // }}
          style={{
            backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
            borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
            color: '#e5e5e5',
            borderRadius: '5px',
          }}
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </CustomModal>
  );
};
