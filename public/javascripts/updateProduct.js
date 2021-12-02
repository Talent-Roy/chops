/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateProduct = async (
  productId,
  name,
  category,
  price,
  quantity,
  priceDiscount,
  description,
  ratingsAverage,
  ratingsQuantity
) => {
  try {
    const id = productId;
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/products/${id}`,
      data: {
        productId,
        name,
        category,
        price,
        quantity,
        priceDiscount,
        description,
        ratingsAverage,
        ratingsQuantity
      }
    });
    // console.log(res.data.data);
    if (res.data.status === 'success') {
      showAlert('success', `Your update was successful.`);
      window.setTimeout(() => {
        location.reload();
      }, 1500000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
