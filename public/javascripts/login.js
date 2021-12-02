/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (
  name,
  email,
  password,
  confirmPassword,
  phoneNum
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword,
        phoneNum
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Welcome to Choperholics, you are now logged in!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      // console.log(res.data);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.replace('/');
  } catch (err) {
    // console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const signout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.replace('/');
    // console.log('route hit');
  } catch (err) {
    // console.log(err.response);
    showAlert('error', 'Error logging out! Please Try again.');
  }
};
