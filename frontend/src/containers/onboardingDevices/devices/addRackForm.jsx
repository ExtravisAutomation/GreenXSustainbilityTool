import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { baseUrl } from '../../../utils/axios';
import Swal from 'sweetalert2';
import { Button, Form, Select, Row, Col, Input, message, Spin } from 'antd';
import { BaseUrl } from '../../../utils/axios';
// import { selectTableData as selectSitesTableData } from "../../../store/features/uamModule/sites/selectors";
import { useSelector, useDispatch } from 'react-redux';

import { CustomInput } from '../../../components/customInput';
import { Validator } from '../../../components/validator';
import { createSiteAsync } from '../../../store/features/uamModule/sites/slices/sitesSlice';
import { createRackAsync } from '../../../store/features/uamModule/racks/slices/racksSlice';
import { integerValidator } from '../../../components/validator';
import { useTheme } from '@mui/material/styles';
import DefaultSelector from '../../../components/defaultSelector';
import CustomModal from '../../../components/customModal';
import KpiSelector from '../../dashboardModule/dashboard/kpiSelector';
import CustomDatePicker from '../../../components/customDatePicker';
import dayjs from 'dayjs';
import { useShowAlert } from '../../../components/ui/showAlert';
import { getRacksBySiteId } from '../../uamModule/inventory/devices/services';
import { fetchSiteNames } from '../../../services/services';
import { getAllBuildings } from '../../../services/rackServices';

const AddRackForm = ({
  handleClose,
  open,
  recordToEdit,
  fetchRacksById,
  onSiteChange = () => {},
  fetchRacksAsync = () => {},
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const openPopup = useShowAlert();
  const access_token = localStorage.getItem('access_token');
  const [messageApi, contextHolder] = message.useMessage();
  const [sites, setSites] = useState();
  const [loading, setLoading] = useState(false);
  const StyledForm = styled(Form)`
    margin: 10px !important;
    .ant-form-item-label > label {
      color: #e5e5e5;
    }
  `;

  const [form3] = Form.useForm();
  const [formLayout, setFormLayout] = useState('vertical');
  const [buildingNames, setBuildingNames] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

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

  const siteNames = async () => {
    // try {
    //   const sitesss = await axios.get(BaseUrl + '/sites/get_site_names');
    //   setSites(
    //     sitesss.data.data.map((item) => {
    //       return {
    //         label: item?.site_name,
    //         value: item?.id,
    //       };
    //     })
    //   );
    // } catch (error) {
    //   console.log('hamara error', error);
    // }
    try {
      const sitesss = await fetchSiteNames();
      console.log('sitesss in component', sitesss);

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
  // console.log('sites in rackForm', sites);

  useEffect(() => {
    siteNames();
    fetchBuildNames();
  }, []);

  const addRack = (values) => {
    values.manufacture_date = dayjs(values.manufacture_date).format(
      'YYYY-MM-DD'
    );
    try {
      dispatch(createRackAsync({ values }));
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        openPopup({
          title: 'Rack added successfully',
          icon: 'success',

          onClose: () => {
            // console.log('Popup closed');
          },
        });

        onSiteChange(selectedSiteId);
        // getRacksBySiteId(selectedSiteId);
        // fetchRacksAsync();
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Error adding rack:', error.message);
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add rack',
        icon: 'error',
        confirmButtonText: 'OK',
        // customClass: {
        //   container: 'custom-swal-container',
        //   title: 'custom-swal-title',
        //   confirmButton: 'custom-swal-button',
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
        onClose: () => {
          console.log('Popup closed');
        },
      });
    }
  };

  const handleChange = (value, option) => {
    setSelectedSiteId(value);
  };
  const fetchBuildNames = async () => {
    try {
      // const res = await axios.get(baseUrl + '/racks/getallbuildings', {
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });

      const res = await getAllBuildings(); // service name for fetching all buildings
      // console.log('Rack in form componment', res);
      setBuildingNames(
        res.data?.map((item) => {
          return {
            label: item?.building_name,
            value: item?.id,
          };
        })
      );
      // console.log('building names', res);
    } catch (error) {
      console.log('hamara error', error);
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

  console.log('selected Site Id:', selectedSiteId);

  return (
    <>
      <Spin spinning={loading}>
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
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
                <DefaultSelector
                  options={sites}
                  onChange={handleChange}
                  raks="true"
                  // value={siteName}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: 'gray',
                      marginBottom: '0px',
                      marginTop: '0px',
                    }}
                  >
                    Building Name
                  </p>
                }
                name="building_id"
                rules={[
                  { required: true, message: 'Please select building' },
                  { validator: integerValidator },
                ]}
              >
                <DefaultSelector options={buildingNames} addDevice="true" />
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={12} md={8}  style={{ padding: "0 10px" }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Unit Position
                  </p>
                }
                name="unit_position"
                rules={[
                  { required: true, message: "Please enter unit_position" },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Please enter a valid input: only accept integers",
                  },
                ]}
              >
                <CustomInput nested="true" placeholder="Enter Unit Position" />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
                rules={[{ required: true, message: 'Please enter rack model' }]}
              >
                <CustomInput nested="true" placeholder="Enter Rack Model" />
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={12} md={8}  style={{ padding: "0 10px" }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Serial Number
                  </p>
                }
                name="serial_number"
                rules={[
                  { required: true, message: "Please enter serial number" },
                ]}
              >
                <CustomInput nested="true" placeholder="Enter Serial Number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}  style={{ padding: "0 10px" }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Rack Unit
                  </p>
                }
                name="Ru"
                rules={[
                  { required: true, message: "Please enter site Ru" },
                  { validator: integerValidator },
                ]}
              >
                <CustomInput nested="true" placeholder="Enter Rack Unit" />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
                {/* <CustomInput nested="true" placeholder="Enter RFS" /> */}
                <CustomDatePicker />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
            {/* <Col xs={24} sm={12} md={8}  style={{ padding: "0 10px" }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Tag Id
                  </p>
                }
                name="Tag_id"
                rules={[{ message: "Please enter Tag id" }]}
              >
                <CustomInput nested="true" placeholder="Enter Tag id" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}  style={{ padding: "0 10px" }}>
              <Form.Item
                label={
                  <p
                    style={{
                      color: "gray",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    Floor
                  </p>
                }
                name="floor"
                rules={[{ required: true, message: "Please enter floor" }]}
              >
                <CustomInput nested="true" placeholder="Enter Floor" />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12} md={8} style={{ padding: '0 10px' }}>
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
                <KpiSelector options={optionsStatus} passwordGroup="true" />
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
              //   backgroundColor: '#0490e7',
              //   borderColor: '#0490e7',
              //   color: '#e5e5e5',
              //   borderRadius: '5px',
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

export default AddRackForm;
