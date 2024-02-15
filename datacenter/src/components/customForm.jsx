import React, { useState, useEffect } from "react";
import { Button, Form, Input, Radio, Select, Row, Col } from "antd";
import { baseUrl } from "../utils/axios";
import Swal from "sweetalert2";
import axios from "axios";
const CustomForm = ({
  submit2,
  submit,
  recordToEdit,
  fetchSites,
  onCancel,
}) => {
  console.log(recordToEdit, "recordToEdit");
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");
  //   const onFormLayoutChange = ({ layout }) => {
  //     setFormLayout(layout);
  //   };
  const access_token = localStorage.getItem("access_token");
  console.log(access_token, "access token");

  useEffect(() => {
    // Load recordToEdit data into form fields when it exists
    if (recordToEdit) {
      form.setFieldsValue(recordToEdit);
    }
  }, [recordToEdit, form]);

  const { Option } = Select;
  const optionsStatus = ["Active", "In Active", "Maintainance"];
  const handleChange = (value, option) => {
    // setSelectedSiteId(value);
  };
  const onFinish = async (values) => {
    console.log(values, "seed form values");
    if (recordToEdit) {
      console.log(values, "values in modal");
      const res = await axios.post(
        baseUrl + `/sites/updatesite/${recordToEdit.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status == "200") {
        Swal.fire({
          title: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          timerProgressBar: true,
          onClose: () => {
            console.log("Popup closed");
          },
        });
        fetchSites();
        form.resetFields();
        onCancel();
      }
      console.log(res, "response");
      // console.log("hello");
    } else {
      submit(values);
      form.resetFields();
    }
  };
  const formItemLayout =
    formLayout === "horizontal"
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
    formLayout === "horizontal"
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
      //   onValuesChange={onFormLayoutChange}
    >
      <Row>
        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Site Name</p>
            }
            name="site_name"
            rules={[{ required: true, message: "Please enter site name" }]}
          >
            <Input placeholder="enter site name" />
          </Form.Item>
        </Col>

        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Site Type</p>
            }
            name="site_type"
            rules={[{ required: true, message: "Please enter site type" }]}
          >
            <Input placeholder="enter site type" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Country</p>
            }
            name="region"
            rules={[{ required: true, message: "Please enter country name" }]}
          >
            <Input placeholder="Enter country name" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>City</p>}
            name="city"
            rules={[{ required: true, message: "Please enter city name" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Status</p>}
            name="status"
            rules={[{ required: true, message: "Please enter site staus" }]}
          >
            <Select
              defaultValue={"Select Status"}
              onChange={handleChange}
              style={{
                width: "100%",
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

        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Latitude</p>
            }
            name="latitude"
            rules={[
              { required: true, message: "Please enter latitude" },
              {
                // pattern: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
                pattern: /^-?\d+\.\d+$/,
                message: "Please enter a valid latitude in decimal",
              },
            ]}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <Input placeholder="Enter latitude in float" />
            </div>
          </Form.Item>
        </Col>
        <Col xl={12} style={{ padding: "5px 10px 5px 10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Longitude</p>
            }
            name="longitude"
            rules={[
              { required: true, message: "Please enter site longitude" },
              {
                pattern: /^-?\d+\.\d+$/,
                message: "Please enter a valid longitude in decimal",
              },
            ]}
          >
            <Input placeholder="Enter longitude in float" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...buttonItemLayout}>
        {recordToEdit ? (
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        ) : (
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
export default CustomForm;
