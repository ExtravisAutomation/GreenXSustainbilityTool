import {
  addPasswordGroupSuccess,
  deletePasswordGroupSuccess,
  editPasswordGroupSuccess,
  fetchPasswordGroupFailure,
  fetchPasswordGroupRequest,
  fetchPasswordGroupSuccess,
} from '../slices/passwordGroupSlice';
import { baseUrl } from '../../../../utils/axios';
import axios from 'axios';
import axiosInstance from '../../../../utils/axios/axiosInstance';
// const access_token = localStorage.getItem("access_token");

export const fetchPasswordGroup = (access_token) => async (dispatch) => {
  dispatch(fetchPasswordGroupRequest());
  try {
    const response = await axiosInstance.get(
      `/sites/sites/get_all_password_groups/`
    );

    dispatch(fetchPasswordGroupSuccess(response.data.data)); // assuming .data.data holds array
  } catch (error) {
    dispatch(
      fetchPasswordGroupFailure(
        error.response?.data?.detail || 'Failed to fetch password groups'
      )
    );
  }
};

export const deletePasswordGroup = (id) => async (dispatch) => {
  dispatch(fetchPasswordGroupRequest());
  try {
    const response = await axiosInstance.post(
      `/sites/sites/delete_password_groups_by_ids/`,
      [id]
    );
    console.log('data after deleting::', response);
    dispatch(deletePasswordGroupSuccess(id));
    dispatch(fetchPasswordGroup());
  } catch (error) {
    dispatch(
      fetchPasswordGroupFailure(
        error.response?.data?.detail || 'Failed to fetch password groups'
      )
    );
  }
};
export const addPasswordGroup = (payload, messageApi) => async (dispatch) => {
  dispatch(fetchPasswordGroupRequest());
  try {
    const response = await axiosInstance.post(
      `/sites/sites/create_password_groups`,
      payload
    );
    console.log('added PG::', response.data.data);

    dispatch(addPasswordGroupSuccess(response.data.data));
    messageApi.open({
      type: 'success',
      content: response.data.message || 'Password group added successfully!',
    });
  } catch (error) {
    dispatch(
      fetchPasswordGroupFailure(
        error.response?.data?.detail || 'Failed to fetch password groups'
      )
    );
  }
};
export const editPasswordGroup =
  (id, payload, messageApi) => async (dispatch) => {
    dispatch(fetchPasswordGroupRequest());
    try {
      const response = await axiosInstance.post(
        `/sites/sites/update_password_groups/${id}`,
        payload
      );
      console.log('added PG::', response.data.data);

      dispatch(editPasswordGroupSuccess(response.data.data));
      messageApi.open({
        type: 'success',
        content: response.data.message || 'Password group added successfully!',
      });
    } catch (error) {
      dispatch(
        fetchPasswordGroupFailure(
          error.response?.data?.detail || 'Failed to fetch password groups'
        )
      );
    }
  };
