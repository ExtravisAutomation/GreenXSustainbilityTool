import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, Select, Row, Col } from 'antd';
import { baseUrl } from '../utils/axios';

import Swal from 'sweetalert2';
import { useUpdateRecordMutation } from '../store/features/uamModule/sites/apis';
import { updateSiteAsync } from '../store/features/uamModule/sites/slices/sitesSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Validator } from './validator';
import { CustomInput } from './customInput';
import { useTheme } from '@mui/material/styles';
import DefaultSelector from './defaultSelector';
import KpiSelector from '../containers/dashboardModule/dashboard/kpiSelector';

const CustomForm = ({
  submit2,
  submit,
  recordToEdit,
  fetchSites,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');

  const access_token = localStorage.getItem('access_token');
  const [updateSite, { isLoading, isError, error, data }] =
    useUpdateRecordMutation();

  useEffect(() => {
    if (recordToEdit) {
      form.setFieldsValue(recordToEdit);
    }
  }, [recordToEdit, form]);

  const { Option } = Select;
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

  const onFinish = async (values) => {
    console.log(values, 'seed form values');
    if (recordToEdit) {
      console.log(recordToEdit.id, 'recordToEdit.id');
      // const response = await updateSite(recordToEdit.id);
      dispatch(updateSiteAsync({ itemId: recordToEdit.id, values: values }));

      form.resetFields();
      onCancel();
      setTimeout(() => {
        fetchSites();

        Swal.fire({
          title: 'Site Updated Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          onClose: () => {
            console.log('Popup closed');
          },
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
      }, 1000);
    } else {
      submit(values);
      form.resetFields();
    }
  };
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

  return (
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
        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={
              <p style={{ color: 'gray', marginBottom: '0px' }}>Site Name</p>
            }
            name="site_name"
            rules={[
              { required: true, message: 'Please enter site name' },
              { validator: Validator },
            ]}
          >
            <CustomInput placeholder="Enter Site Name" />
          </Form.Item>
        </Col>

        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={
              <p style={{ color: 'gray', marginBottom: '0px' }}>Site Type</p>
            }
            name="site_type"
            rules={[
              { required: true, message: 'Please enter site type' },
              { validator: Validator },
            ]}
          >
            <CustomInput placeholder="Enter Site Type" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={
              <p style={{ color: 'gray', marginBottom: '0px' }}>Country</p>
            }
            name="region"
            rules={[
              { required: true, message: 'Please enter country name' },
              { validator: Validator },
            ]}
          >
            <CustomInput placeholder="Enter Country Name" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={<p style={{ color: 'gray', marginBottom: '0px' }}>City</p>}
            name="city"
            rules={[
              { required: true, message: 'Please enter city name' },
              { validator: Validator },
            ]}
          >
            <CustomInput placeholder="Enter City" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={<p style={{ color: 'gray', marginBottom: '0px' }}>Status</p>}
            name="status"
            rules={[{ required: true, message: 'Please enter site staus' }]}
          >
            <KpiSelector
              options={optionsStatus}
              value={'Select Status'}
              passwordGroup="true"
            />
          </Form.Item>
        </Col>

        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={
              <p style={{ color: 'gray', marginBottom: '0px' }}>Latitude</p>
            }
            name="latitude"
            rules={[
              { required: true, message: 'Please enter latitude' },
              {
                pattern: /^-?\d+\.\d+$/,
                message: 'Please enter a valid latitude in decimal',
              },
            ]}
          >
            <CustomInput placeholder="Enter Latitude" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: '5px 10px 5px 10px' }}>
          <Form.Item
            label={
              <p style={{ color: 'gray', marginBottom: '0px' }}>Longitude</p>
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
            <CustomInput placeholder="Enter Longitude" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        {...buttonItemLayout}
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        {recordToEdit ? (
          <Button
            style={{
              // backgroundColor: theme?.palette?.drop_down_button?.add_background,
              // color: theme?.palette?.drop_down_button?.add_text,
              backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
              borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
            }}
            type="primary"
            htmlType="submit"
          >
            Update
          </Button>
        ) : (
          <Button
            style={{
              // backgroundColor: theme?.palette?.drop_down_button?.add_background,
              // color: theme?.palette?.drop_down_button?.add_text,
              backgroundColor: `${theme?.palette?.main_layout?.secondary_text}`,
              borderColor: `${theme?.palette?.main_layout?.secondary_text}`,
            }}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
export default CustomForm;
