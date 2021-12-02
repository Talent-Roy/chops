/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const cart = async productId => {
  try {
    const id = productId;
    const res = await axios({
      method: 'POST',
      url: `/api/v1/cart/add-to-cart/${id}`
    });
    if (res.data.status === 'success') {
      //   console.log(res.data);
      showAlert('success', `your order has been added to the cart!`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const cartRemoveOne = async productId => {
  try {
    const id = productId;
    const res = await axios({
      method: 'POST',
      url: `/api/v1/cart/reduce-by-one/${id}`
    });
    if (res.data.status === 'success') {
      // console.log(res.data);
      showAlert('success', `you have removed this item from cart!`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
