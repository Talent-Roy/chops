/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const postReview = async (productId, review, rating) => {
  try {
    // console.log(productId);
    const res = await axios({
      method: 'POST',
      url: `/api/v1/products/${productId}/reviews`,
      data: {
        review,
        rating,
        productId
      }
    });
    if (res.data.status === 'success') {
      // console.log(res.data.status);
      showAlert('success', `Thanks for reviewing this product`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
