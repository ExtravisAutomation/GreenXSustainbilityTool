import axiosInstance from '../../utils/axios/axiosInstance';

export const fetchAllRoles = async () => {
  const response = await axiosInstance.get(`/admin/getroles`);
  return response?.data?.data;
};
export const addRole = async (payload) => {
  const response = await axiosInstance.post(`/admin/addrole`, payload);
  if (response?.status == 200) {
    // console.log('Role added');
  }

  return response;
};
export const updateRole = async (id, payload) => {
  const response = await axiosInstance.post(`/admin/updaterole/${id}`, payload);
  if (response?.status == 200) {
    // console.log('Role added');
  }

  return response;
};
export const deleteUserRole = async (id) => {
  const response = await axiosInstance.post(`/admin/deleterole`, [id]);
  if (response?.status == 200) {
    console.log('Deleted SuccessFully::::::');
  }

  return response;
};

// Modules Services
export const fetchAllModules = async () => {
  const response = await axiosInstance.get(`/admin/getDashboardmodules`);
  //   /api/v2/admin/getDashboardmodules
  return response?.data?.data;
};

export const addModule = async (payload) => {
  const response = await axiosInstance.post(`/admin/addmodule`, payload);
  if (response?.status == 200) {
    // console.log('Role added');
  }

  return response;
};

export const removeModule = async (id) => {
  const response = await axiosInstance.post(`/admin/deleteDashboardmodule`, [
    id,
  ]);
  //   /api/v2/admin/deleteDashboardmodule
  if (response?.status == 200) {
    // console.log('Role added');
  }

  return response;
};

export const updateModule = async (id, payload) => {
  const response = await axiosInstance.post(
    `/admin/updateDashboardmodule/${id}`,
    payload
  );

  if (response?.status == 200) {
    // console.log('Role added');
  }

  return response;
};

// Users Page services
export const fetchAllUsers = async () => {
  const response = await axiosInstance.get(`/admin/getalluser`);
  return response?.data?.data;
};

export const addUserService = async (payload) => {
  const response = await axiosInstance.post(`/admin/adduser`, payload);
  if (response?.status == 200) {
    console.log('userAdded added');
  }

  return response;
};
