import React, { useEffect, useState } from "react";
import CustomForm from "../../../components/customForm";
// import CustomFormRacks from "./form";
import { Icon } from "@iconify/react";
import axios from "axios";
import { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Select, Row, Col, Input } from "antd";
import dayjs from "dayjs";
import moment from "moment";

const access_token = localStorage.getItem("access_token");
console.log(access_token, "access toke");
const CustomModalSeeds = ({ handleClose, open, recordToEdit, fetchRacks }) => {
  //   const [open, setOpen] = useState(false);

  const handleOk = async (values) => {
    console.log(values, "values in modal");
    // setLoading(true);
    // setOpen(false);
    // values.manufacture_date = dayjs(values.manufacture_date).format(
    //   "YYYY-MM-DD"
    // );
    // values.site_id = Number(values.site_id);
    // values.unit_position = Number(values.unit_position);
    // values.Ru = Number(values.Ru);
    // values.Height = Number(values.Height);
    // values.Width = Number(values.Width);
    // values.Depth = Number(values.Depth);
    // values.floor = Number(values.floor);
    // values.total_devices = Number(values.total_devices);

    // const res = await axios.post(baseUrl + "/racks/addrack", values, {
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    // });
    // if (res.status == "200") {
    //   handleCancel();

    //   Swal.fire({
    //     title: res.data.message,
    //     icon: "success",
    //     confirmButtonText: "OK",
    //     timer: 2000,
    //     timerProgressBar: true,
    //     onClose: () => {
    //       console.log("Popup closed");
    //     },
    //   });
    //   fetchRacks();
    // }
    // console.log(res, "response");
  };

  const handleCancel = (e) => {
    console.log(e);
    handleClose();
  };

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");

  const access_token = localStorage.getItem("access_token");
  console.log(access_token, "access token");
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

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

  const handleDropdownVisibleChange2 = async (open) => {
    if (open && options2.length === 0) {
      try {
        setLoading2(true);
        const response = await axios.get(baseUrl + "/racks/getallracks", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        console.log(response, "aaaaa");
        if (response) {
          setLoading2(false);
          setOptions2(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading2(false);
      } finally {
        setLoading2(false);
      }
    }
  };

  const onFinish = async (values) => {
    console.log(values, "racke form values");
    handleCancel();
    // values.manufacture_date = dayjs(values.manufacture_date).format(
    //   "YYYY-MM-DD"
    // );
    // if (recordToEdit) {
    //   setLoading(true);
    //   // setOpen(false);
    //   const res = await axios.post(
    //     baseUrl + `/racks/updaterack/${recordToEdit.id}`,
    //     values,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${access_token}`,
    //       },
    //     }
    //   );
    //   if (res.status == "200") {
    //     Swal.fire({
    //       title: res.data.message,
    //       icon: "success",
    //       confirmButtonText: "OK",
    //       timer: 2000,
    //       timerProgressBar: true,
    //       onClose: () => {
    //         console.log("Popup closed");
    //       },
    //     });
    //     fetchRacks();
    //     form.resetFields();
    //     // onCancel();
    //   }
    //   console.log(res, "response");

    //   console.log("hello");
    // } else {
    //   //   submit(values);
    //   form.resetFields();
    // }
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

  const optionsStatus = ["Green", "Red"];
  return (
    <Modal
      width={"70%"}
      style={{ color: "white" }}
      open={open}
      title={
        <h3 style={{ color: "white" }}>
          {recordToEdit ? "Update Seed" : "Add Seed"}
        </h3>
      }
      onOk={handleOk}
      onCancel={handleCancel}
      closeIcon={<CustomCloseIcon />}
      footer={false}
    >
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
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>Device IP</p>
              }
              name="device_ip"
              rules={[{ required: true, message: "Please enter device ip" }]}
            >
              <Input placeholder="enter device ip" />
            </Form.Item>
          </Col>
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>Sites</p>
              }
              name="site_id"
              rules={[{ required: true, message: "Please enter site id" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option.children ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA.children ?? "")
                    .toLowerCase()
                    .localeCompare((optionB.children ?? "").toLowerCase())
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
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>Racks</p>
              }
              name="rack_name"
              rules={[{ required: true, message: "Please enter site id" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option.value ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA.value ?? "")
                    .toLowerCase()
                    .localeCompare((optionB.value ?? "").toLowerCase())
                }
                loading={loading2}
                onDropdownVisibleChange={handleDropdownVisibleChange2}
                // onChange={handleChange}
                // value={selectedSiteId}
              >
                {options2.map((option) => (
                  <Option key={option.rack_name} value={option.rack_name}>
                    {option.rack_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>
                  Device Name
                </p>
              }
              name="device name"
              rules={[{ required: true, message: "Please enter Device Name" }]}
            >
              {/* <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              inputReadOnly={true}
            /> */}
              <Input placeholder="Enter Device Name" />
            </Form.Item>
          </Col>
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>
                  Device type
                </p>
              }
              name="device_type"
              rules={[
                { required: true, message: "Please enter Device type" },
                // {
                //   pattern: /^[0-9]+$/,
                //   message: "Please enter a valid input: only accept integers",
                // },
              ]}
            >
              <Input placeholder="Enter Device type" />
            </Form.Item>
          </Col>
          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>
                  Creadentials Profile +
                </p>
              }
              name="creadentials_rofile"
              rules={[
                {
                  required: true,
                  message: "Please enter Creadentials Profile +",
                },
              ]}
            >
              <Input placeholder="Enter creadentials profile" />
            </Form.Item>
          </Col>

          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={<p style={{ color: "gray", marginBottom: "0px" }}>Ru</p>}
              name="Ru"
              rules={[{ required: true, message: "Please enter site Ru" }]}
            >
              <Input placeholder="Enter Ru" />
            </Form.Item>
          </Col>

          <Col xl={8} style={{ padding: "10px" }}>
            <Form.Item
              label={
                <p style={{ color: "gray", marginBottom: "0px" }}>
                  onboarding status
                </p>
              }
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
    </Modal>
  );
};

export default CustomModalSeeds;
const CustomCloseIcon = () => (
  <span style={{ color: "red" }}>
    <Icon fontSize={"25px"} icon="material-symbols:close" />
  </span>
);
