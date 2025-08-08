import axiosInstance from '../../utils/axios/axiosInstance';

export const loginUser = async (username, password) => {
  console.log('Login services called');

  const response = await axiosInstance.post('/auth/sign-in', {
    user_name: username,
    password: password,
  });
  console.log('login response data', response);

  return response;
};

export const signupUser = async (payload) => {
  console.log('signup services called');

  const response = await axiosInstance.post('/auth/sign-up', payload);
  console.log('signup response data', response);

  return response;
};
