import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Radio, Row, DatePicker, Select } from "antd";
import { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

// import dayjs from "dayjs";
// import "dayjs/locale/en"; // Import the locale you need

// import customParseFormat from "dayjs/plugin/customParseFormat"; // Import the plugin
// dayjs.extend(customParseFormat);
// dayjs.locale("en"); // Set the locale globally
import dayjs from "dayjs";

const CustomFormRacks = ({
  submit2,
  submit,
  recordToEdit,
  fetchSites,
  onCancel,
  fetchRacks,
}) => {
  console.log(recordToEdit, "recordToEdit");
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");

  const access_token = localStorage.getItem("access_token");
  console.log(access_token, "access token");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  useEffect(() => {
    if (recordToEdit) {
      const updateDate =
        recordToEdit.manufacture_date === ""
          ? ""
          : moment(recordToEdit.manufacture_date);
      form.setFieldsValue({ ...recordToEdit, manufacture_date: updateDate });
    }
  }, [recordToEdit, form]);

  const dateFormat = "YYYY-MM-DD";

  const { Option } = Select;
  const handleDropdownVisibleChange = async (open) => {
    if (open && options.length === 0) {
      try {
        setLoading(true);
        const response = await axios.get(baseUrl + "/sites/getallsites", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        console.log(response, "aaaaa");
        if (response) {
          setLoading(false);
          setOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const onFinish = async (values) => {
    console.log(values, "racke form values");
    values.manufacture_date = dayjs(values.manufacture_date).format(
      "YYYY-MM-DD"
    );
    if (recordToEdit) {
      setLoading(true);
      // setOpen(false);
      const res = await axios.post(
        baseUrl + `/racks/updaterack/${recordToEdit.id}`,
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
        fetchRacks();
        form.resetFields();
        onCancel();
      }
      console.log(res, "response");

      console.log("hello");
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

  const handleChange = (value, option) => {
    setSelectedSiteId(value);
  };
  console.log(selectedSiteId, "site id");

  const optionsStatus = ["Active", "In Active", "Maintainance"];
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
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>Rack Name</p>
            }
            name="rack_name"
            rules={[{ required: true, message: "Please enter rack name" }]}
          >
            <Input placeholder="enter rack name" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Site</p>}
            name="site_id"
            rules={[{ required: true, message: "Please enter site id" }]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB.label ?? "").toLowerCase())
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
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>
                Manufacture Name
              </p>
            }
            name="manufacture name"
            rules={[
              { required: true, message: "Please enter manufacture name" },
            ]}
          >
            {/* <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              inputReadOnly={true}
            /> */}
            <Input placeholder="Enter Manufacture name" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>
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
            <Input placeholder="Enter unit position" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>rack_model</p>
            }
            name="rack_model"
            rules={[{ required: true, message: "Please enter rack model" }]}
          >
            <Input placeholder="Enter rack_model" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>PN Code</p>
            }
            name="pn_code"
            rules={[
              { required: true, message: "Please enter pn code" },
              // {
              //   pattern: /^[0-9]+$/,
              //   message: "Please enter a valid number: only accept integers",
              // },
            ]}
          >
            <Input placeholder="Enter pn code" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>
                serial number
              </p>
            }
            name="serial_number"
            rules={[{ required: true, message: "Please enter serial number" }]}
          >
            <Input placeholder="Enter serial number" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Ru</p>}
            name="Ru"
            rules={[{ required: true, message: "Please enter site Ru" }]}
          >
            <Input placeholder="Enter Ru" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>RFS</p>}
            name="RFS"
            rules={[{ required: true, message: "Please enter RFS" }]}
          >
            <Input placeholder="enter RFS" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Height</p>}
            name="Height"
            rules={[{ required: true, message: "Please enter Height" }]}
          >
            <Input placeholder="enter Height" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Width</p>}
            name="Width"
            rules={[{ required: true, message: "Please enter Width" }]}
          >
            <Input placeholder="Enter Width" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Depth</p>}
            name="Depth"
            rules={[{ required: true, message: "Please enter Depth" }]}
          >
            <Input placeholder="Enter Depth" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>Tag id</p>}
            name="Tag_id"
            rules={[{ required: true, message: "Please enter Tag id" }]}
          >
            <Input placeholder="Enter Tag id" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>floor</p>}
            name="floor"
            rules={[{ required: true, message: "Please enter floor" }]}
          >
            <Input placeholder="Enter floor" />
          </Form.Item>
        </Col>
        <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={<p style={{ color: "gray", marginBottom: "0px" }}>status</p>}
            name="status"
            rules={[{ required: true, message: "Please enter status" }]}
          >
            {/* <Input placeholder="Enter status" /> */}
            <Select
              defaultValue={"Select Status"} // set a default value if needed
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
        {/* <Col xl={6} style={{ padding: "10px" }}>
          <Form.Item
            label={
              <p style={{ color: "gray", marginBottom: "0px" }}>
                total_devices
              </p>
            }
            name="total_devices"
            rules={[{ required: true, message: "Please enter total devices" }]}
          >
            <Input placeholder="Enter total devices" />
          </Form.Item>
        </Col> */}
      </Row>

      <Form.Item
        style={{ display: "flex", justifyContent: "end" }}
        {...buttonItemLayout}
      >
        <Button type="primary" htmlType="submit">
          {recordToEdit ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CustomFormRacks;
