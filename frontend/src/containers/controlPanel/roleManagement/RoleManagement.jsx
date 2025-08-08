import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select, Button, Tag, Avatar, Form, Table, Tooltip } from 'antd';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import EditUserRoleModal from './EditUserRoleModal';
import CustomCard from '../../../components/customCard';
import { useTheme } from '@mui/material';
import DefaultTable from '../../../components/tables';
import { CustomInput } from '../../../components/customInput';
import DefaultSelector from '../../../components/defaultSelector';
import AddRoleModal from './AddRoleModal';
import { useEffect } from 'react';
import {
  addModule,
  addRole,
  deleteUserRole,
  fetchAllModules,
  fetchAllRoles,
  removeModule,
  updateModule,
  updateRole,
} from '../../../services/controlPanelServices/controlPanelServices';
import AddModuleModal from './AddModuleModal';

const { Option } = Select;

const FilterBar = styled.div`
  background: ${(props) => props.theme.palette?.default_card?.background};
  padding: 16px 0px;
  // border-radius: 8px;
  display: flex;
  border-bottom: 2px solid
    ${(props) => props.theme.palette?.main_layout?.border_bottom};
  gap: 16px;
  margin-bottom: 16px;
  align-items: stretch;
  // flex-wrap: wrap;
`;

const RoleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  gap: 15px;

  strong {
    color: ${(props) => props.theme.palette?.main_layout?.secondary_text};
    margin: 0 20px;
  }
`;
const RoleItem = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;

  color: ${(props) => props?.theme?.palette?.main_layout?.primary_text};
  background: ${(props) =>
    props?.theme?.palette?.main_layout?.sideBar?.icon_bg};
`;

const UserStatus = styled.div`
  color: ${(props) => props.theme.palette?.status?.color};
  background: ${(props) => props.theme.palette?.status?.background};
  disple: flex;
  width: max-content;
  padding: 2px 8px;
  border-radius: 12px;
`;

const moduleList = [
  'Dashboard',
  'Onboarding Devices',
  'Inventory',
  'Reports',
  'V Center',
  'AI Engine',
];

const RoleManagement = () => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [roleOptions, setRoleOptions] = useState([]);
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editModule, setEditModule] = useState(null);
  const [roleForm] = Form.useForm();
  const [moduleForm] = Form.useForm();
  // for roles
  const [roleAdded, setRoleAdded] = useState(false);
  const [roleEdited, setRoleEdited] = useState(false);
  const [roleDeleted, setRoleDeleted] = useState(false);
  // for modules
  const [moduleAdded, setModuleAdded] = useState(false);
  const [moduleEdited, setModuleEdited] = useState(false);
  const [moduleDeleted, setModuleDeleted] = useState(false);

  const [users, setUsers] = useState([
    {
      key: '1',
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Admin',
      modules: ['Dashboard', 'Users', 'Reports', 'Content'],
      status: 'active',
      lastLogin: '2024-01-15',
    },
    {
      key: '2',
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Manager',
      modules: ['Dashboard', 'Analytics'],
      status: 'active',
      lastLogin: '2024-01-14',
    },
    {
      key: '3',
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'Editor',
      modules: ['Dashboard', 'Content'],
      status: 'active',
      lastLogin: '2024-01-13',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedRole ? user.role === selectedRole : true)
  );

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleUpdateUser = (values) => {
    const updatedUser = {
      ...editingUser,
      ...values,
    };

    const updatedUsers = users.map((user) =>
      user.key === updatedUser.key ? updatedUser : user
    );

    setUsers(updatedUsers);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span style={{ fontSize: 13, color: '#888' }}>{text}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => <p>{role}</p>,
    },
    {
      title: 'Access Modules',
      dataIndex: 'modules',
      key: 'modules',
      render: (modules) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {modules.map((m) => (
            <div
              key={m}
              style={{
                color: theme?.palette?.access_module?.color,
                background: theme?.palette?.access_module?.background,
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => <UserStatus theme={theme}>{status}</UserStatus>,
    },
    // {
    //   title: 'Last Login',
    //   dataIndex: 'lastLogin',
    // },
    // {
    //   title: 'Actions',
    //   render: (_, record) => (
    //     <>
    //       <EditOutlined
    //         style={{ color: '#1677ff', marginRight: 12, cursor: 'pointer' }}
    //         onClick={() => openEditModal(record)}
    //       />
    //       <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
    //     </>
    //   ),
    // },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* <Tooltip title="View">
            <EyeOutlined
              style={{
                fontSize: 17,
                color: theme?.palette?.main_layout?.secondary_text,
              }}
              // onClick={() => openEditModal(record)}
            />
          </Tooltip> */}
          <Tooltip
            overlayInnerStyle={{
              backgroundColor: theme?.palette?.default_card?.background, // background color
              color: theme?.palette?.default_card?.color, // text color
            }}
            title="Edit"
          >
            <FaRegEdit
              style={{
                fontSize: 17,
                color: `${theme?.palette?.main_layout?.secondary_text}`,
              }}
              // onClick={() => handleEdit(record)}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBin6Line
              style={{ fontSize: 17, color: '#fb0200' }}
              // onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const modulesOptions = moduleList.map((mod) => ({
    label: mod,
    value: mod,
  }));

  // For bothe add and edit
  const handleAddRole = async (values) => {
    const payload = {
      role_name: values?.roleName,
    };

    try {
      if (editRole) {
        const response = await updateRole(editRole.id, payload);
        if (response?.status == 200) {
          setRoleEdited((prev) => !prev);
        }
      } else {
        const response = await addRole(payload);
        if (response?.status == 200) {
          setRoleAdded((prev) => !prev);
        }
      }

      setIsAddRoleOpen(false);
      setEditRole(null);
      roleForm.resetFields();
    } catch (error) {
      console.log('Error saving role', error);
    }
  };

  const deleteRole = async (id) => {
    try {
      const response = await deleteUserRole(id);
      if (response?.status == 200) {
        setRoleDeleted((prev) => !prev);
      }
    } catch (error) {}
  };
  const getRoles = async () => {
    try {
      const response = await fetchAllRoles(); // assume this returns an array of role objects
      // console.log('Roles', response);

      const formattedRoles = response?.map((role) => ({
        id: role?.id,
        label: role?.role_name,
        value: role?.role_name,
      }));
      console.log('formatted Roles', formattedRoles);
      setRoleOptions(formattedRoles);
    } catch (error) {
      console.log('Error in fetch Roles', error);
    }
  };

  // handleModuleSubmit
  const handleModuleSubmit = async (values) => {
    const payload = {
      modules_name: values?.moduleName,
    };

    try {
      if (editModule) {
        const response = await updateModule(editModule.id, payload);
        if (response?.status == 200) {
          setModuleEdited((prev) => !prev);
        }
      } else {
        const response = await addModule(payload);
        if (response?.status == 200) {
          setModuleAdded((prev) => !prev);
        }
      }

      setIsModuleOpen(false);
      setEditModule(null);
      moduleForm.resetFields();
    } catch (error) {
      console.log('Error saving role', error);
    }
  };
  const getModules = async () => {
    try {
      const response = await fetchAllModules(); // assume this returns an array of role objects
      console.log('Modules', response);

      const formattedModules = response?.map((modules) => ({
        id: modules?.id,
        label: modules?.modules_name,
        value: modules?.modules_name,
      }));
      console.log('formatted Modules', formattedModules);
      setModules(formattedModules);
    } catch (error) {
      console.log('Error in fetch Roles', error);
    }
  };

  const deleteModule = async (id) => {
    try {
      const response = await removeModule(id);
      if (response?.status == 200) {
        setModuleDeleted((prev) => !prev);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getRoles();
    getModules();
  }, []);

  // for Roles
  useEffect(() => {
    if (roleAdded || roleDeleted || roleEdited) {
      getRoles();
      setRoleAdded(false);
      setRoleDeleted(false);
      setRoleEdited(false); // ✅ clear edited state too
    }
  }, [roleAdded, roleDeleted, roleEdited]);

  // for Modules
  useEffect(() => {
    if (moduleAdded || moduleDeleted || moduleEdited) {
      getModules();
      setModuleAdded(false);
      setModuleDeleted(false);
      setModuleEdited(false); // ✅ clear edited state too
    }
  }, [moduleAdded, moduleDeleted, moduleEdited]);

  // Cpanel Options Here for Role Options:
  const renderCPanelOptions = (menu, setOpen) => (
    <>
      <div>
        {roleOptions?.map((option) => (
          <div
            key={option?.value}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 12px',
              color: theme?.palette?.default_select?.color,
              borderBottom: `1px solid ${theme?.palette?.available_options?.border_bottom}`,
            }}
          >
            <span>{option?.label}</span>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaRegEdit
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: `${theme?.palette?.main_layout?.secondary_text}`,
                }}
                // onClick={() => handleEdit(record)}
                onClick={() => {
                  // setIsAddRoleOpen(true);
                  // setEditRole(option); // Pass selected role object
                  setEditRole(option);
                  setIsAddRoleOpen(true);
                  setOpen(false); // ✅ Close dropdown
                }}
              />
              <RiDeleteBin6Line
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Prevent dropdown closing
                  deleteRole(option?.id);
                }}
                style={{
                  color: '#fb0200',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        style={{
          color: theme?.palette?.default_button?.primary_text,
          background: theme?.palette?.default_button?.add_background,
          border: 'none',
          width: '100%',
        }}
        onClick={() => {
          setIsAddRoleOpen(true);
          setOpen(false); // ✅ Close dropdown on Add too
        }}
      >
        Add Role
      </Button>
    </>
  );

  // Cpanel Options Here for Modules:
  const renderCPanelModules = (menu, setOpen) => (
    <>
      <div>
        {modules?.map((module) => (
          <div
            key={module?.value}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 12px',
              color: theme?.palette?.default_select?.color,
              borderBottom: `1px solid ${theme?.palette?.available_options?.border_bottom}`,
            }}
          >
            <span>{module?.label}</span>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaRegEdit
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: `${theme?.palette?.main_layout?.secondary_text}`,
                }}
                // onClick={() => handleEdit(record)}
                onClick={() => {
                  setEditModule(module);
                  setIsModuleOpen(true);
                  setOpen(false); // ✅ Close dropdown
                }}
              />
              <RiDeleteBin6Line
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Prevent dropdown closing
                  deleteModule(module?.id);
                }}
                style={{
                  color: '#fb0200',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        style={{
          color: theme?.palette?.default_button?.primary_text,
          background: theme?.palette?.default_button?.add_background,
          border: 'none',
          width: '100%',
        }}
        onClick={() => {
          setIsModuleOpen(true);
          setOpen(false); // ✅ Close dropdown on Add too
        }}
      >
        Add Module
      </Button>
    </>
  );
  return (
    <CustomCard
      style={{
        border: `1px solid ${theme?.palette?.default_card?.border}`,
        backgroundColor: theme?.palette?.main_layout?.background,
        borderRadius: '7px',
      }}
    >
      <FilterBar theme={theme}>
        {/* <Input
          prefix={<SearchOutlined />}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        /> */}

        <CustomInput
          nested="true"
          style={{
            width: '250px',
          }}
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <DefaultSelector
          options={roleOptions}
          setRoleOptions={setRoleOptions}
          setIsAddRoleOpen={setIsAddRoleOpen}
          deleteRole={deleteRole}
          
          value={'Available Roles'}
          placeholder="Available Roles"
          width="250px"
          showSearch={false}
          cPanel={true}
        /> */}
        <DefaultSelector
          cPanel={true}
          options={roleOptions}
          value="Available Role"
          // onChange={setSelectedRole}
          setIsAddRoleOpen={setIsAddRoleOpen}
          dropdownRender={renderCPanelOptions}
          width="250px"
        />
        {/* <RoleContainer theme={theme}>
          <strong>Available Roles:</strong>
          {roleOptions?.map((role) => (
            // <span key={role?.value}>{role?.label}</span>
            <RoleItem theme={theme} key={role?.value}>
              {role?.label}
            </RoleItem>
          ))}
        </RoleContainer> */}
        <DefaultSelector
          cPanel={true}
          options={modules}
          value="Available Modules"
          // onChange={setSelectedRole}
          setIsModuleOpen={setIsModuleOpen}
          dropdownRender={renderCPanelModules}
          width="250px"
        />
        {/* <div
          style={{ display: 'flex', flexGrow: '1', justifyContent: 'flex-end' }}
        >
          <Button
            style={{
              color: theme?.palette?.default_button?.primary_text,
              background: theme?.palette?.default_button?.add_background,
              border: 'none',
            }}
            onClick={() => setIsAddRoleOpen(true)}
          >
            Add Role
          </Button>
        </div> */}
      </FilterBar>
      <DefaultTable
        rowKey="id"
        // rowClassName={(record, index) => (index % 2 === 0 ? 'even' : 'odd')}
        rowClassName={(record, index) =>
          `custom-row-spacing ${index % 2 === 0 ? 'even' : 'odd'}`
        }
        size="small"
        dataSource={filteredUsers.length > 0 ? [...filteredUsers] : [...users]}
        columns={columns}
        pagination={{
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 50, users?.length],
        }}
      />
      {/* check again */}
      {/* <EditUserRoleModal
        open={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        handleSubmit={handleUpdateUser}
        userForm={form}
        modules={modulesOptions}
        roles={roleOptions}
        editUser={editingUser}
        theme={theme}
      /> */}

      {/* <AddRoleModal
        open={isAddRoleOpen}
        handleClose={() => {
          setIsAddRoleOpen(false);
          roleForm.resetFields();
        }}
        handleSubmit={handleAddRole}
        roleForm={roleForm}
        theme={theme}
      /> */}
      <AddRoleModal
        open={isAddRoleOpen}
        handleClose={() => {
          setIsAddRoleOpen(false);
          roleForm.resetFields();
          setEditRole(null); // Reset after close
        }}
        handleSubmit={handleAddRole}
        roleForm={roleForm}
        editRole={editRole}
        theme={theme}
      />
      <AddModuleModal
        open={isModuleOpen}
        handleClose={() => {
          setIsModuleOpen(false);
          moduleForm.resetFields();
          setEditModule(null); // Reset after close
        }}
        handleModuleSubmit={handleModuleSubmit}
        moduleForm={moduleForm}
        editModule={editModule}
        theme={theme}
      />
    </CustomCard>
  );
};

export default RoleManagement;
