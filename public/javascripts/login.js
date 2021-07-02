/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, confirmPassword) => {
  const urlDev = 'http://localhost:8080/api/v1/users/signup';
  const urlProd = 'http://handyman.herokuapp.com/users/signup';
  try {
    const res = await axios({
      method: 'POST',
      url: urlProd,
      data: {
        name,
        email,
        password,
        confirmPassword
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully! You can now log in.');
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
      url: 'http://localhost:8080/api/v1/users/login',
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
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8080/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.replace('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
