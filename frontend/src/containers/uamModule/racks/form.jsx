import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Col, Form, Input, Radio, Row, DatePicker, Select } from 'antd';
import { baseUrl } from '../../../utils/axios';
import { BaseUrl } from '../../../utils/axios';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Validator } from '../../../components/validator';
import { integerValidator } from '../../../components/validator';

import dayjs from 'dayjs';
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { updateRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { CustomInput } from '../../../components/customInput';
import DefaultSelector from '../../../components/defaultSelector';
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector';
import CustomModal from '../../../components/customModal';
import AddBuildingForm from './addBuildingForm';
import CustomDatePicker from '../../../components/customDatePicker';
import {
  // fetchSiteNames,
  getAllBuildings,
} from '../../../services/rackServices';
import { fetchSiteNames } from '../../../services/services';

const CustomFormRacks = ({
  submit2,
  submit,
  recordToEdit,
  fetchSites,
  onCancel,
  fetchRacks,
}) => {
  const theme = useTheme();
  const access_token = localStorage.getItem('access_token');

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [sites, setSites] = useState();
  const [buildingNames, setBuildingNames] = useState([]);
  const [openAddBuildingModal, setOpenAddBuildingModal] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      const updateDate =
        recordToEdit.manufacture_date === ''
          ? ''
          : moment(recordToEdit.manufacture_date);
      form.setFieldsValue({ ...recordToEdit, manufacture_date: updateDate });
    }
  }, [recordToEdit, form]);

  const dateFormat = 'YYYY-MM-DD';

  const { Option } = Select;

  // useEffect(() => {
  //   dispatch(fetchsitesAsync());
  // }, [dispatch]);
  // const sites = useSelector((state) => state.sites?.sites);

  const siteNames = async () => {
    try {
      const sitesData = await fetchSiteNames();

      setSites(
        sitesData.map((item) => ({
          label: item?.site_name,
          value: item?.id,
        }))
      );
    } catch (error) {
      console.log('Error in fetch Sites', error);
    }
  };
  // Old code:
  // const siteNames = async () => {
  //   // console.log('Site Names in Rack Form');

  //   try {
  //     const sitesss = await axios.get(baseUrl + '/sites/get_site_names', {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     setSites(
  //       sitesss.data.data.map((item) => {
  //         return {
  //           label: item?.site_name,
  //           value: item?.id,
  //         };
  //       })
  //     );
  //   } catch (error) {
  //     console.log('hamara error', error);
  //   }
  // };

  // Old code

  // const fetchBuildNames = async () => {
  //   try {
  //     const res = await axios.get(baseUrl + '/racks/getallbuildings', {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     setBuildingNames(
  //       res.data?.map((item) => {
  //         return {
  //           label: item?.building_name,
  //           value: item?.id,
  //         };
  //       })
  //     );
  //     console.log('building names', res);
  //   } catch (error) {
  //     console.log('hamara error', error);
  //   }
  // };

  const fetchBuildNames = async () => {
    try {
      const buildings = await getAllBuildings();

      setBuildingNames(
        buildings.map((item) => ({
          label: item?.building_name,
          value: item?.id,
        }))
      );

      // console.log('building names', buildings);
    } catch (error) {
      console.log('hamara error', error);
    }
  };

  useEffect(() => {
    siteNames();
    fetchBuildNames();
  }, []);

  const onFinish = async (values) => {
    // console.log(values, 'racke form values');
    values.manufacture_date = dayjs(values.manufacture_date).format(
      'YYYY-MM-DD'
    );
    if (recordToEdit) {
      dispatch(updateRackAsync({ itemId: recordToEdit?.id, values }));
      form.resetFields();
      onCancel();
      setTimeout(() => {
        fetchRacks();
        Swal.fire({
          title: 'Rack Updated Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
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
          onClose: () => {
            console.log('Popup closed');
          },
        });
      }, 1000);
    } else {
      submit(values);
      form.resetFields();
      onCancel();
    }
  };
  // console.log('recordToEdit..', recordToEdit);

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

  const handleChange = (value, option) => {
    console.log(value);

    setSelectedSiteId(value);
  };

  const optionsStatus = [
    { value: 'Active', label: 'Active' },
    {
      value: 'In Active',
      label: 'In Active',
    },
    {
      value: 'Maintainance',
      label: 'Maintainance',
    },
  ];
  // const onChange = (date, dateString) => {
  //   console.log(date, dateString);
  // };
  return (
    <>
      <CustomModal
        open={openAddBuildingModal}
        title="Add Building"
        handleClose={() => setOpenAddBuildingModal(false)}
        // addDevice="true"
        buildingModal="true"
      >
        <AddBuildingForm
          siteNames={siteNames}
          handleClose={() => setOpenAddBuildingModal(false)}
          fetchBuildNames={fetchBuildNames}
        />
      </CustomModal>
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{
          layout: formLayout,
        }}
      >
        <Row>
          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Rack Name</p>
              }
              name="rack_name"
              rules={[{ required: true, message: 'Please enter rack name' }]}
            >
              <CustomInput placeholder="Enter rack name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={<p style={{ color: 'gray', marginBottom: '0px' }}>Site</p>}
              name="site_id"
              rules={[{ required: true, message: 'Please select a site' }]}
            >
              <DefaultSelector
                options={sites}
                onChange={handleChange}
                value={selectedSiteId}
                raks="true"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Form.Item
                label={
                  <p style={{ color: 'gray', marginBottom: '0px' }}>
                    Building Name
                  </p>
                }
                name="building_id"
                rules={[
                  { required: true, message: 'Please select a building name' },
                ]}
              >
                <DefaultSelector options={buildingNames} addDevice="true" />
              </Form.Item>
              {/* mycode: add building modal opens Here */}
              <Button
                size="large"
                onClick={() => setOpenAddBuildingModal(true)}
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
            </div>
          </Col>

          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Rack Model</p>
              }
              name="rack_model"
              rules={[{ required: true, message: 'Please enter rack model' }]}
            >
              <CustomInput placeholder="Enter rack model" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>RFS Date</p>
              }
              name="RFS"
              rules={[{ required: true, message: 'Please enter RFS' }]}
            >
              {/* <CustomInput placeholder="Enter RFS date" /> */}
              <CustomDatePicker />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Height</p>
              }
              name="Height"
              rules={[
                { required: true, message: 'Please enter Height' },
                { validator: integerValidator },
              ]}
            >
              <CustomInput placeholder="Enter height" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Width</p>
              }
              name="Width"
              rules={[
                { required: true, message: 'Please enter Width' },
                { validator: integerValidator },
              ]}
            >
              <CustomInput placeholder="Enter width" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Depth</p>
              }
              name="Depth"
              rules={[
                { required: true, message: 'Please enter Depth' },
                { validator: integerValidator },
              ]}
            >
              <CustomInput placeholder="Enter depth" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} xl={8} style={{ padding: '10px' }}>
            <Form.Item
              label={
                <p style={{ color: 'gray', marginBottom: '0px' }}>Status</p>
              }
              name="status"
              rules={[{ required: true, message: 'Please enter status' }]}
            >
              <KpiSelector
                options={optionsStatus}
                value={'Select Status'}
                passwordGroup="true"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'end',
          }}
          {...buttonItemLayout}
        >
          <Button
            style={{
              backgroundColor: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.drop_down_button?.add_text,
            }}
            type="primary"
            htmlType="submit"
          >
            {recordToEdit ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default CustomFormRacks;
