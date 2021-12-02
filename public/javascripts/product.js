/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const product = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/products`,
      data
    });
    // console.log(data);
    if (res.data.status === 'success') {
      showAlert('success', `Congrats! your product has been created.`);
      window.setTimeout(() => {
        location.replace('/products');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
