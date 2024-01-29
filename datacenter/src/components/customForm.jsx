import React, { useState } from "react";
import { Button, Form, Input, Radio } from "antd";
const CustomForm = ({ submit }) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("vertical");
  //   const onFormLayoutChange = ({ layout }) => {
  //     setFormLayout(layout);
  //   };
  const onFinish = (values) => {
    console.log("Form values:", values);

    // Call the submit function passed as a prop
    submit(values);
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
      <Form.Item
        label={<p style={{ color: "gray", marginBottom: "0px" }}>Email</p>}
        name="email1"
      >
        <Input placeholder="Input email" />
      </Form.Item>
      <Form.Item
        label={<p style={{ color: "gray", marginBottom: "0px" }}>Email</p>}
        name="email2"
      >
        <Input placeholder="Input email" />
      </Form.Item>
      <Form.Item
        label={<p style={{ color: "gray", marginBottom: "0px" }}>Email</p>}
        name="email3"
      >
        <Input placeholder="Input email" />
      </Form.Item>
      <Form.Item
        label={<p style={{ color: "gray", marginBottom: "0px" }}>Email</p>}
        name="email4"
      >
        <Input placeholder="Input email" />
      </Form.Item>
      <Form.Item {...buttonItemLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CustomForm;
