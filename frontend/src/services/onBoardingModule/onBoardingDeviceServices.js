import axiosInstance from '../../utils/axios/axiosInstance';

export const deleteOnBoardDevice = async (id) => {
  // console.log('Service called');

  const response = await axiosInstance.post('/sites/sites/delete_devices', [
    id,
  ]);
  return response;
};

export const makeOnboardDevices = async (device_ids) => {
  const payload = { device_ids };
  const response = await axiosInstance.post(
    '/sites/sites/onboard_devices',
    payload
  );
  return response;
};

export const addOnboardDevice = async (data) => {
  const response = await axiosInstance.post(
    '/sites/sites/create_onboard_devices',
    data
  );
  return response;
};

export const updateOnboardDevice = async (deviceId, data) => {
  console.log('device Id:', deviceId);

  const response = await axiosInstance.post(
    `/sites/sites/update_device/${deviceId}`,
    data
  );
  return response;
};

export const createDeviceType = async (payload) => {
  const response = await axiosInstance.post(
    '/device_inventory/create_device_type',
    payload
  );
  return response?.data;
};
export const createVendor = async (payload) => {
  const response = await axiosInstance.post(
    '/device_inventory/create_vendor',
    payload
  );
  return response?.data;
};
