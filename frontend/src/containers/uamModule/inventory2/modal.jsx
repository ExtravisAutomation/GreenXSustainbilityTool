import React, { useEffect, useState } from 'react';
import CustomForm from '../../../components/customForm';
// import CustomFormRacks from "./form";
import { Icon } from '@iconify/react';
import axios from 'axios';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
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
import { useShowAlert } from '../../../components/ui/showAlert';
import CustomSpin from '../../../components/CustomSpin';
const access_token = localStorage.getItem('access_token');

const StyledForm = styled(Form)`
  margin: 10px !important;
  .ant-form-item-label > label {
    color: #e5e5e5;
  }
`;
const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #0490e7 !important;
    padding: 10px 10px 15px 20px;

    margin-bottom: 20px;
  }

  .ant-modal-title {
    color: #e5e5e5;
    margin-top: 5px !important;
  }
  .ant-modal-content {
    padding: 0px 0px 5px 0px !important;
  }
`;
const CustomModalSeeds = ({ handleClose, open, recordToEdit, fetchSeeds }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // console.log(recordToEdit, "recordToEdit");
  const [messageApi, contextHolder] = message.useMessage();
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const openPopup = useShowAlert();

  const handleOk = async (values) => {};

  const handleCancel = (e) => {
    console.log(e);
    handleClose();
  };

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');

  const access_token = localStorage.getItem('access_token');
  // console.log(access_token, "access token");
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedRackId, setSelectedRackId] = useState(null);
  const [passwordGroup, setPasswordGroup] = useState();
  const [selectedPasswordGroupId, setSelectedPasswordGroupId] = useState(null);
  console.log('selectedPasswordGroupId', selectedPasswordGroupId);
  const dateFormat = 'YYYY-MM-DD';

  const { Option } = Select;

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
      setPasswordGroup(res?.data?.data);
    } catch (error) {}
  };
  const fetchDeviceTypes = async () => {
    if (selectedVendor) {
      try {
        const res = await axios.get(
          baseUrl +
            `/sites/sites/get_all_device_types?vendor=${selectedVendor}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log('device type res', res);
        setDeviceTypes(res?.data?.data);
      } catch (error) {}
    }
  };
  useEffect(() => {
    fetchPasswordGroups();
    fetchDeviceTypes();
  }, [selectedVendor]);

  useEffect(() => {
    if (recordToEdit) {
      const updateDate =
        recordToEdit.manufacture_date === ''
          ? ''
          : moment(recordToEdit.manufacture_date);
      form2.setFieldsValue({ ...recordToEdit, manufacture_date: updateDate });
    }
  }, [recordToEdit, form2]);
  const fetchRacksById = async () => {
    try {
      if (selectedSiteId) {
        const res = await axios.post(
          baseUrl + `/sites/get_racks_by_site_id/${selectedSiteId}`
        );
        console.log('racks by id', res);
        setOptions2(res?.data?.data?.racks);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchRacksById();
  }, [selectedSiteId]);
  useEffect(() => {
    dispatch(fetchsitesAsync());
    dispatch(fetchRacksAsync(selectedSiteId));
  }, [dispatch]);
  const sites = useSelector((state) => state.sites?.sites);
  const racks = useSelector((state) => state.racks?.racks);

  const handleDropdownVisibleChange = async (open) => {
    setOptions(sites);
  };

  const handleDropdownVisibleChange2 = async (open) => {
    console.log(open, 'open');
    if (selectedSiteId) {
      // setOptions2(racks);
    } else {
      messageApi.open({
        type: 'error',
        content: 'Please select a site first',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
    }
  };

  const addDevice = async (values) => {
    // console.log(values, "racke form values");
    setLoading(true);
    try {
      if (recordToEdit) {
        const res = await axios.post(
          baseUrl + `/sites/sites/update_device/${recordToEdit?.id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(res, 'update res');
        if (res?.status == '200') {
          setLoading(false);
          messageApi.open({
            type: 'success',
            content: res.data.message,
          });
          setTimeout(() => {
            fetchSeeds();
            handleCancel();
          }, 1000);
        }
      } else {
        const modifiedValues = {
          ...values,
          device_name: 'ATS-SDNSF-GIS-APIC-CON-01',
          device_type: 'apic',
        };
        console.log('modifiedValues', modifiedValues);
        const res = await axios.post(
          baseUrl + '/sites/sites/create_onboard_devices',
          values,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(res, 'resres');
        if (res?.status == '200') {
          setLoading(false);
          messageApi.open({
            type: 'success',
            content: res.data.message,
          });
          setTimeout(() => {
            fetchSeeds();
            handleCancel();
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error, 'errororororor');
      setLoading(false);
    }
  };
  const addSite = (values) => {
    console.log('hello', values);
    try {
      // const response = addSite(values);
      // console.log("Site added successfully:", response);
      dispatch(createSiteAsync(values));
      Swal.fire({
        title: 'Site added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        onClose: () => {
          console.log('Popup closed');
        },
        // add site on some other page
        // customClass: {
        //   container: "custom-swal-container",
        //   title: "custom-swal-title",
        //   confirmButton: "custom-swal-button",
        // },
        customClass: {
          container:
            theme?.mode == 'light'
              ? 'custom-swal-container'
              : 'custom-swal-container-dark',
          title: 'custom-swal-title',
          confirmButton: theme?.name?.includes('Purple')
            ? 'custom-swal-button-purple'
            : theme?.name?.includes('Green')
              ? 'custom-swal-button-green'
              : 'custom-swal-button-blue',
        },
      });

      setOpen2(false);
    } catch (error) {
      console.error('Error adding site:', error.message);
    }
  };
  const addRack = (values) => {
    try {
      dispatch(createRackAsync({ values }));
      setTimeout(() => {
        // fetchRacks();
        openPopup({
          title: 'Rack added successfully',
          icon: 'success',
          onClose: () => {
            console.log('Popup closed');
          },
        });
        fetchRacksById();
        setOpen3(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding rack:', error.message);

      Swal.fire({
        title: 'Error',
        text: 'Failed to add rack',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal-container',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
        },
        onClose: () => {
          console.log('Popup closed');
        },
      });
    }
  };
  const handleChange = (value, option) => {
    console.log('vendor', value);
    setSelectedSiteId(value);
  };
  const handleChangeVendor = (value, option) => {
    console.log('vendor', value);
    setSelectedVendor(value);
  };
  const handleChangeDeviceType = (value) => {
    console.log(value);
  };
  const handleChange2 = (value, option) => {
    setSelectedRackId(value);
  };

  const handleChange3 = (value, option) => {
    console.log('Selected Password Group IDD:', value);
    setSelectedPasswordGroupId(value);
  };

  // console.log(passwordGroup, "passwordGroup");

  const optionsStatus = ['Active', 'InActive', 'Maintenance'];
  return (
    <>
      {contextHolder}
      <StyledModal
        width={'70%'}
        open={open}
        title={recordToEdit ? 'Update Device' : 'Add Device'}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
        style={{
          top: 20,
        }}
      >
        <CustomSpin spinning={loading}>
          <StyledForm
            {...formItemLayout}
            layout={formLayout}
            form={form2}
            name="form2"
            onFinish={addDevice}
            initialValues={{
              layout: formLayout,
            }}
          >
            <Row>
              {/* <Col xs={24} lg={8} style={{ padding: "10px" }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: "gray",
                        marginBottom: "0px",
                      }}
                    >
                      Device Name
                    </p>
                  }
                  name="device_name"
                  rules={[
                    { required: true, message: "Please enter Device Name" },
                  ]}
                >
                  <CustomInput placeholder="Enter Device Name" />
                </Form.Item>
              </Col> */}
              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Device IP
                    </p>
                  }
                  name="ip_address"
                  rules={[
                    { required: true, message: 'Please enter device ip' },
                  ]}
                >
                  <CustomInput placeholder="Enter Device IP" />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>Vendor</p>
                  }
                  name="device_name"
                  rules={[
                    { required: true, message: 'Please enter Device type' },
                  ]}
                >
                  <Select
                    showSearch
                    size="large"
                    style={{ width: '100%' }}
                    className="custom-selector2"
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option.children ?? '').toLowerCase().includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA.children ?? '')
                        .toLowerCase()
                        .localeCompare((optionB.children ?? '').toLowerCase())
                    }
                    loading={loading}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    onChange={handleChangeVendor}
                    value={selectedSiteId}
                  >
                    {['cisco']?.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Device Type
                    </p>
                  }
                  name="device_type"
                  // rules={[
                  //   { required: true, message: "Please enter Device type" },
                  // ]}
                >
                  <Select
                    showSearch
                    size="large"
                    style={{ width: '100%' }}
                    className="custom-selector2"
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option.children ?? '').toLowerCase().includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA.children ?? '')
                        .toLowerCase()
                        .localeCompare((optionB.children ?? '').toLowerCase())
                    }
                    loading={loading}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    onChange={handleChangeDeviceType}
                    value={selectedSiteId}
                  >
                    {deviceTypes &&
                      deviceTypes?.map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Form.Item
                    label={
                      <p style={{ color: 'gray', marginBottom: '0px' }}>
                        Sites
                      </p>
                    }
                    name="site_id"
                    rules={[
                      { required: true, message: 'Please select a site' },
                    ]}
                    // style={{ display: "flex", alignItems: "center" }}
                  >
                    <Select
                      showSearch
                      size="large"
                      style={{ width: 'calc(100% - 40px)' }} // Adjust the width to leave space for the button
                      className="custom-selector3"
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option.children ?? '').toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA.children ?? '')
                          .toLowerCase()
                          .localeCompare((optionB.children ?? '').toLowerCase())
                      }
                      loading={loading}
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                      onChange={handleChange}
                      value={selectedSiteId}
                    >
                      {options?.map((option) => (
                        <Option key={option.value} value={option.id}>
                          {option.site_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    size="large"
                    onClick={() => setOpen2(true)}
                    style={{
                      background: 'transparent',
                      borderColor: '#34404b',
                      borderLeft: 'none',
                      color: '#e5e5e5',
                      borderRadius: '0 5px 5px 0',
                      position: 'absolute',
                      top: '44px',
                      right: '0',
                    }}
                  >
                    +
                  </Button>
                </div>
              </Col>
              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Form.Item
                    label={
                      <p style={{ color: 'gray', marginBottom: '0px' }}>
                        Racks
                      </p>
                    }
                    name="rack_id"
                    rules={[
                      { required: true, message: 'Please select a rack' },
                    ]}
                  >
                    <Select
                      showSearch
                      className="custom-selector3"
                      style={{ width: 'calc(100% - 40px)' }}
                      size="large"
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option.children ?? '').toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA.children ?? '')
                          .toLowerCase()
                          .localeCompare((optionB.children ?? '').toLowerCase())
                      }
                      loading={loading2}
                      onDropdownVisibleChange={handleDropdownVisibleChange2}
                      onChange={handleChange2}
                      value={selectedRackId}
                      // dropdownStyle={{ backgroundColor: "#36424e", color: "white" }}
                    >
                      {options2?.map((option) => (
                        <Option key={option.rack_name} value={option.id}>
                          {option.rack_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    size="large"
                    onClick={() => setOpen3(true)}
                    style={{
                      background: 'transparent',
                      borderColor: '#34404b',
                      borderLeft: 'none',
                      color: '#e5e5e5',
                      borderRadius: '0 5px 5px 0',
                      position: 'absolute',
                      top: '44px',
                      right: '0',
                    }}
                  >
                    +
                  </Button>
                </div>
              </Col>
              <Col xs={24} lg={12} style={{ padding: '10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Password Group
                    </p>
                  }
                  name="password_group_id"
                  rules={[{ required: true, message: 'Please enter status' }]}
                >
                  <Select
                    className="custom-selector2"
                    size="large"
                    // defaultValue={"Select Status"}
                    placeholder="Select Password Group"
                    value={selectedPasswordGroupId}
                    onChange={handleChange3}
                    style={{
                      width: '100%',
                    }}
                  >
                    {passwordGroup?.map((option) => (
                      <Option key={option?.id} value={option?.id}>
                        {option?.password_group_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xs={24} lg={12} style={{ padding: "10px" }}>
                <Form.Item
                  label={
                    <p style={{ color: "gray", marginBottom: "0px" }}>
                      Rack Unit
                    </p>
                  }
                  name="rack_unit"
                  // rules={[{ required: true, message: "Please enter site Ru" }]}
                >
                  <CustomInput placeholder="Enter Rack Unit" />
                </Form.Item>
              </Col> */}
            </Row>

            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
              {...buttonItemLayout}
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
                  backgroundColor: '#0490e7',
                  borderColor: '#0490e7',
                  color: '#e5e5e5',
                  borderRadius: '5px',
                }}
                type="primary"
                htmlType="submit"
              >
                {recordToEdit ? 'Update' : 'Submit'}
              </Button>
            </Form.Item>
          </StyledForm>
        </CustomSpin>
      </StyledModal>
      <StyledModal
        width={'50%'}
        open={open2}
        title={'Add Site'}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
        style={{
          top: 45,
        }}
      >
        <CustomSpin spinning={loading}>
          <StyledForm
            {...formItemLayout}
            layout={formLayout}
            form={form1}
            name="form1"
            onFinish={addSite}
            initialValues={{
              layout: formLayout,
            }}
          >
            <Row>
              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Site Name
                    </p>
                  }
                  name="site_name"
                  rules={[
                    { required: true, message: 'Please enter site name' },
                    { validator: Validator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Site Name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Site Type
                    </p>
                  }
                  name="site_type"
                  rules={[
                    { required: true, message: 'Please enter site type' },
                    { validator: Validator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Site Type" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Country
                    </p>
                  }
                  name="region"
                  rules={[
                    { required: true, message: 'Please enter country name' },
                    { validator: Validator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Country Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>City</p>
                  }
                  name="city"
                  rules={[
                    { required: true, message: 'Please enter city name' },
                    { validator: Validator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter City" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>Status</p>
                  }
                  name="status"
                  rules={[
                    { required: true, message: 'Please enter site staus' },
                  ]}
                >
                  <Select
                    className="custom-selector2"
                    defaultValue={'Select Status'}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      height: '35px',
                    }}
                  >
                    {optionsStatus.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Latitude
                    </p>
                  }
                  name="latitude"
                  rules={[
                    { required: true, message: 'Please enter latitude' },
                    {
                      // pattern: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
                      pattern: /^-?\d+\.\d+$/,
                      message: 'Please enter a valid latitude in decimal',
                    },
                  ]}
                >
                  <CustomInput
                    nested="true"
                    placeholder="Enter Latitude in Float"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
                <Form.Item
                  label={
                    <p style={{ color: 'gray', marginBottom: '0px' }}>
                      Longitude
                    </p>
                  }
                  name="longitude"
                  rules={[
                    { required: true, message: 'Please enter site longitude' },
                    {
                      pattern: /^-?\d+\.\d+$/,
                      message: 'Please enter a valid longitude in decimal',
                    },
                  ]}
                >
                  <CustomInput
                    nested="true"
                    placeholder="Enter Longitude in Float"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
              {...buttonItemLayout}
            >
              <Button
                onClick={() => setOpen2(false)}
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
                  backgroundColor: '#0490e7',
                  borderColor: '#0490e7',
                  color: '#e5e5e5',
                  borderRadius: '5px',
                }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </StyledForm>
        </CustomSpin>
      </StyledModal>

      <StyledModal
        width={'60%'}
        open={open3}
        title={'Add Rack'}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={false}
        footer={false}
        style={{
          top: 35,
        }}
      >
        <CustomSpin spinning={loading}>
          <StyledForm
            {...formItemLayout}
            layout={formLayout}
            form={form3}
            name="form3"
            onFinish={addRack}
            initialValues={{
              layout: formLayout,
            }}
          >
            <Row>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Rack Name
                    </p>
                  }
                  name="rack_name"
                  rules={[
                    { required: true, message: 'Please enter rack name' },
                    // { validator: Validator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Rack Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Site
                    </p>
                  }
                  name="site_id"
                  rules={[{ required: true, message: 'Please select a site' }]}
                >
                  <Select
                    showSearch
                    style={{ width: '100%', height: '35px' }}
                    className="custom-selector2"
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option.label ?? '').includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA.label ?? '')
                        .toLowerCase()
                        .localeCompare((optionB.label ?? '').toLowerCase())
                    }
                    loading={loading}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    onChange={handleChange}
                    value={selectedSiteId}
                  >
                    {options.map((option) => (
                      <Option key={option.value} value={option.id}>
                        {option.site_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Unit Position
                    </p>
                  }
                  name="unit_position"
                  rules={[
                    { required: true, message: 'Please enter unit_position' },
                    {
                      pattern: /^[0-9]+$/,
                      message:
                        'Please enter a valid input: only accept integers',
                    },
                  ]}
                >
                  <CustomInput
                    nested="true"
                    placeholder="Enter Unit Position"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Rack Model
                    </p>
                  }
                  name="rack_model"
                  rules={[
                    { required: true, message: 'Please enter rack model' },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Rack Model" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Serial Number
                    </p>
                  }
                  name="serial_number"
                  rules={[
                    { required: true, message: 'Please enter serial number' },
                  ]}
                >
                  <CustomInput
                    nested="true"
                    placeholder="Enter Serial Number"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Rack Unit
                    </p>
                  }
                  name="Ru"
                  rules={[
                    { required: true, message: 'Please enter site Ru' },
                    { validator: integerValidator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Rack Unit" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      RFS
                    </p>
                  }
                  name="RFS"
                  rules={[{ required: true, message: 'Please enter RFS' }]}
                >
                  <CustomInput nested="true" placeholder="Enter RFS" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Height
                    </p>
                  }
                  name="Height"
                  rules={[
                    { required: true, message: 'Please enter Height' },
                    { validator: integerValidator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Height" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Width
                    </p>
                  }
                  name="Width"
                  rules={[
                    { required: true, message: 'Please enter Width' },
                    { validator: integerValidator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Width" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Depth
                    </p>
                  }
                  name="Depth"
                  rules={[
                    { required: true, message: 'Please enter Depth' },
                    { validator: integerValidator },
                  ]}
                >
                  <CustomInput nested="true" placeholder="Enter Depth" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Tag Id
                    </p>
                  }
                  name="Tag_id"
                  rules={[{ message: 'Please enter Tag id' }]}
                >
                  <CustomInput nested="true" placeholder="Enter Tag id" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Floor
                    </p>
                  }
                  name="floor"
                  rules={[{ required: true, message: 'Please enter floor' }]}
                >
                  <CustomInput nested="true" placeholder="Enter Floor" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} xl={6} style={{ padding: '0 10px' }}>
                <Form.Item
                  label={
                    <p
                      style={{
                        color: 'gray',
                        marginBottom: '0px',
                        marginTop: '0px',
                      }}
                    >
                      Status
                    </p>
                  }
                  name="status"
                  rules={[{ required: true, message: 'Please enter status' }]}
                >
                  {/* <Input placeholder="Enter status" /> */}
                  <Select
                    defaultValue={'Select Status'} // set a default value if needed
                    onChange={handleChange}
                    style={{ width: '100%', height: '35px' }}
                    className="custom-selector2"
                  >
                    {optionsStatus.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
              {...buttonItemLayout}
            >
              <Button
                onClick={() => setOpen3(false)}
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
                //   backgroundColor: "#0490e7",
                //   borderColor: "#0490e7",
                //   color: "#e5e5e5",
                //   borderRadius: "5px",
                // }}
                style={{
                  // backgroundColor:
                  //   theme?.palette?.drop_down_button?.add_background,
                  color: theme?.palette?.drop_down_button?.add_text,
                  backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
                  borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
                  borderRadius: '5px',
                  color: '#e5e5e5',
                }}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </StyledForm>
        </CustomSpin>
      </StyledModal>
    </>
  );
};

export default CustomModalSeeds;
const CustomCloseIcon = () => (
  <span style={{ color: '#e5e5e5' }}>
    <Icon fontSize={'25px'} icon="material-symbols:close" />
  </span>
);
