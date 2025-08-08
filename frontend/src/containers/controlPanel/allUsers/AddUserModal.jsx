import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'antd';
import styled from 'styled-components';
import { CustomInput } from '../../../components/customInput';
import DefaultSelector from '../../../components/defaultSelector';
import CustomModal from '../../../components/customModal';

const StyledForm = styled(Form)`
  padding: 10px 20px;
`;

const AddUserModal = ({
  open,
  handleClose,
  handleSubmit,
  userForm,
  modules,
  handleAddModule,
  roles,
  theme,
  editUser,
  // password,
}) => {
  const formItemsConfig = [
    {
      label: 'Name',
      name: 'name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter name' }],
      props: { placeholder: 'Enter Name' },
    },
    {
      label: 'User Name',
      name: 'username',
      type: 'input',
      rules: [{ required: true, message: 'Please enter user name' }],
      props: { placeholder: 'Enter User Name' },
    },
    {
      label: 'Email',
      name: 'email',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter email' },
        { type: 'email', message: 'Invalid email format' },
      ],
      props: { placeholder: 'Enter Email' },
    },
    {
      label: 'Role',
      name: 'role',
      type: 'select',
      rules: [{ required: true, message: 'Please select a role' }],
      props: {
        options: roles,
        placeholder: 'Select Role',
      },
    },
    {
      label: 'Modules',
      name: 'modules',
      type: 'select',
      rules: [{ required: true, message: 'Please select at least one module' }],
      props: {
        options: modules,
        mode: 'multiple',
        placeholder: 'Select Modules',
      },
      button: {
        onClick: handleAddModule,
      },
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      rules: [{ required: true, message: 'Please enter password' }],
      props: { placeholder: 'Enter Password' },
    },
  ];

  const renderComponent = (type, props) => {
    // console.log('props', props);

    const finalProps = { style: { width: '100%' }, type, ...props };
    switch (type) {
      case 'input':
        return <CustomInput {...finalProps} />;
      case 'password':
        return <CustomInput {...finalProps} />;
      case 'select':
        return (
          <DefaultSelector
            {...finalProps}
            width="100%"
            raks={true}
            mode={props?.mode}
          />
        );
      default:
        return null;
    }
  };

  const generateRandomPassword = (length) => {
    const chars =
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      '0123456789' +
      '!@#$%^&*()?';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log('passswordGenerated:::', pwd);

    userForm.setFieldsValue({ password: pwd });
  };
  useEffect(() => {
    if (editUser) {
      userForm.setFieldsValue({
        ...editUser,
        modules: Array.isArray(editUser.modules)
          ? editUser.modules
          : typeof editUser.modules === 'string'
            ? editUser.modules.split(',').map((m) => m.trim())
            : [],
      });
    }
  }, [editUser, userForm]);

  return (
    <CustomModal
      open={open}
      title={editUser ? 'Edit User' : 'Add User'}
      onCancel={handleClose}
      footer={null}
    >
      <StyledForm layout="vertical" form={userForm} onFinish={handleSubmit}>
        <Row>
          {formItemsConfig.map((item, index) => (
            <Col xs={24} md={12} key={index} style={{ padding: '10px' }}>
              <Form.Item
                label={
                  <p style={{ color: 'gray', marginBottom: '0px' }}>
                    {item.label}
                  </p>
                }
                name={item.name}
                rules={item.rules}
              >
                {renderComponent(item.type, item.props)}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row style={{ justifyContent: 'flex-end', padding: '0px 10px' }}>
          <Button
            onClick={() => {
              generateRandomPassword(10);
            }}
            style={{
              backgroundColor: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.drop_down_button?.add_text,
              borderRadius: '5px',
              marginTop: '0px',
              border: 'none',
            }}
          >
            Generate Password
          </Button>
        </Row>
        <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            onClick={() => {
              handleClose();
              userForm.resetFields();
            }}
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
              backgroundColor: theme?.palette?.drop_down_button?.add_background,
              color: theme?.palette?.drop_down_button?.add_text,
              borderRadius: '5px',
            }}
            type="primary"
            htmlType="submit"
          >
            {editUser ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </StyledForm>
    </CustomModal>
  );
};
export default AddUserModal;
