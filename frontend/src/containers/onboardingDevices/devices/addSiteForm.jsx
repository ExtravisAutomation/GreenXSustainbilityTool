import React, { useEffect, useState } from 'react';
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
// import { selectTableData as selectSitesTableData } from "../../../../store/features/uamModule/sites/selectors";
import { selectTableData as selectRacksTableData } from '../../../store/features/uamModule/racks/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchRecordsQuery as usefetchRacksQuery } from '../../../store/features/uamModule/racks/apis';
// import { useFetchRecordsQuery as usefetchSitesQuery } from "../../../../store/features/uamModule/sites/apis";
import { fetchsitesAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { fetchRacksAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { CustomInput } from '../../../components/customInput';
import { Validator } from '../../../components/validator';
import { createSiteAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { createRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { integerValidator } from '../../../components/validator';
import { useTheme } from '@mui/material/styles';
// import DefaultSelector from "../../../components/defaultSelector";
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector';

const AddSiteForm = ({ handleClose, siteNames }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const StyledForm = styled(Form)`
    margin: 10px !important;
    .ant-form-item-label > label {
      color: #e5e5e5;
    }
  `;
  console.log('theme name: ', theme.name);
  const [form1] = Form.useForm();

  const [formLayout, setFormLayout] = useState('vertical');

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

  const addSite = (values) => {
    try {
      dispatch(createSiteAsync(values));
      setLoading(true);
      setTimeout(() => {
        Swal.fire({
          title: 'Site added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          onClose: () => {
            console.log('Popup closed');
          },
          // customClass: {
          //   container: "custom-swal-container",
          //   title: "custom-swal-title",
          //   confirmButton: "custom-swal-button",
          // },
          // add site
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
        }).then(() => {
          setLoading(false);
          siteNames();
          handleClose();
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Error adding site:', error.message);
    }
  };

  const optionsStatus = [
    {
      value: 'Active',
      label: 'Active',
    },

    {
      value: 'InActive',
      label: 'InActive',
    },
    {
      value: 'Maintenance',
      label: 'Maintenance',
    },
  ];
  return (
    <>
      <Spin spinning={loading}>
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
                  <p style={{ color: 'gray', marginBottom: '0px' }}>Country</p>
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
                rules={[{ required: true, message: 'Please enter site staus' }]}
              >
                <KpiSelector options={optionsStatus} passwordGroup="true" />
                {/* <Select
                className="custom-selector2"
                defaultValue={"Select Status"}
               
                style={{
                  width: "100%",
                  height: "35px",
                }}
              >
                {optionsStatus.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select> */}
              </Form.Item>
            </Col>

            <Col xs={24} md={12} xl={8} style={{ padding: '5px 10px' }}>
              <Form.Item
                label={
                  <p style={{ color: 'gray', marginBottom: '0px' }}>Latitude</p>
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
              onClick={handleClose}
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
      </Spin>
    </>
  );
};

export default AddSiteForm;
