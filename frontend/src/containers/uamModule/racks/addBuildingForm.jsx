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

const AddBuildingForm = ({ handleClose, fetchBuildNames }) => {
  const access_token = localStorage.getItem('access_token');
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

  const addBuilding = async (values) => {
    handleClose();
    try {
      setLoading(true);
      const res = await axios.post(baseUrl + '/racks/addbuilding', values, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.status === 200) {
        console.log('building res....', res);
        fetchBuildNames();
        setLoading(false);
        messageApi.open({
          type: 'success',
          content: 'Building name created successfully!',
        });
        handleClose();
      } else {
        setLoading(true);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error adding site:', error.message);
      messageApi.open({
        type: 'error',
        content: 'Something wrong',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <StyledForm
          {...formItemLayout}
          layout={formLayout}
          form={form1}
          name="form1"
          onFinish={addBuilding}
          initialValues={{
            layout: formLayout,
          }}
        >
          <Row>
            <Col xs={24} style={{ padding: '5px 10px' }}>
              <Form.Item
                label={
                  <p style={{ color: 'gray', marginBottom: '0px' }}>
                    Building Name
                  </p>
                }
                name="building_name"
                rules={[
                  { required: true, message: 'Please enter building name' },
                  { validator: Validator },
                ]}
              >
                <CustomInput nested="true" placeholder="Enter building name" />
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
              style={{
                backgroundColor: theme?.palette?.main_layout?.secondary_text,
                borderColor: theme?.palette?.main_layout?.secondary_text,
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
      </Spin>
    </>
  );
};

export default AddBuildingForm;
