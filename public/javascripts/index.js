/* eslint-disable */
//eslint esversion:6
import '@babel/polyfill';
import { signup, login, logout, signout } from './login';
import { postReview } from './review';
import { updateSettings } from './updateSettings';
import { cart, cartRemoveOne } from './cart';
import { showAlert } from './alert';
import { product } from './product';
import { updateProduct } from './updateProduct';
import { startTimer } from './timer';
import axios from 'axios';

document.DOMContentLoaded = function() {
  document
    .getElementById('displayReviewForm')
    .addEventListener('click', showReview);
};

window.onload = function() {
  var twty4Hours = 24 * 60 * 60,
    display = document.querySelector('.timer');
  startTimer(twty4Hours, display);
};

// DOM ELEMENTS
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.logout');
const signOutBtn = document.querySelector('.signout');
const signupForm = document.querySelector('.signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const postReviewForm = document.querySelector('.post-review');
const postProductForm = document.querySelector('.post-product-form');
const updateProductForm = document.getElementById('updateProduct');
const addToCart = document.querySelectorAll('.add-to-cart');
const reduceByOne = document.querySelectorAll('.reduce-by-one');

/**
 * authenticaton ------------------------------------------------------
 */
if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.signup_btn').textContent = 'Creating...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phoneNum = document.getElementById('phoneNum').value;
    signup(name, email, password, confirmPassword, phoneNum);
  });

if (loginForm)
  loginForm.addEventListener(
    'submit',
    e => {
      e.preventDefault();
      document.querySelector('.login_btn').textContent = 'loggin in...';
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    },
    { once: true }
  );

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (signOutBtn) signOutBtn.addEventListener('click', signout);

/**--------------------------------------------------------------------------------- */

/**
 * User data update
 */

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.user_data_btn').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    // document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('current-password').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    await updateSettings(
      currentPassword,
      password,
      confirmPassword,
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('current-password').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
  });

/**-------------------------------------------------------------------- */

/**review------------------------------------------------------------- */

if (postReviewForm)
  postReviewForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.review_btn').textContent = 'Reviewing...';
    const { productId } = e.target.dataset;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    postReview(productId, review, rating);
  });
/**------------------------------------------------------------------- */

/**products------------------------------------------------------------- */
if (postProductForm)
  postProductForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.prod_btn').textContent = 'Creating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('category', document.getElementById('category').value);
    form.append('quantity', document.getElementById('quantity').value);
    form.append('price', document.getElementById('price').value);
    form.append(
      'priceDiscount',
      document.getElementById('priceDiscount').value
    );
    form.append('description', document.getElementById('description').value);
    form.append('images', document.getElementById('images').files[0]);
    form.append('images', document.getElementById('images').files[1]);
    form.append('images', document.getElementById('images').files[2]);
    console.log(form);

    await product(form, 'data');
  });

if (updateProductForm)
  updateProductForm.addEventListener('submit', async e => {
    e.preventDefault();
    // document.querySelector('.update_prod_btn').textContent = 'Updating...';

    const { productId } = e.target.dataset;

    const name = document.getElementById('updatedName').value;
    const category = document.getElementById('updatedCategory').value;
    const price = document.getElementById('updatedPrice').value;
    const quantity = document.getElementById('updatedQuantity').value;
    const priceDiscount = document.getElementById('updatedPriceDiscount').value;
    const description = document.getElementById('updatedDescription').value;
    const ratingsAverage = document.getElementById('updatedRatingsAverage')
      .value;
    const ratingsQuantity = document.getElementById('updatedRatingsQuantity')
      .value;

    await updateProduct(
      productId,
      name,
      category,
      price,
      quantity,
      priceDiscount,
      description,
      ratingsAverage,
      ratingsQuantity
    );
  });

/**----------------------------------------------------------------------- */

/**cart-----------------------------------------------------------------*/

if (addToCart)
  addToCart.forEach(el => {
    el.addEventListener('submit', e => {
      e.preventDefault();

      const { productId } = e.target.dataset;
      // console.log(productId);
      cart(productId);
    });
  });

if (reduceByOne)
  reduceByOne.forEach(el => {
    el.addEventListener('submit', e => {
      e.preventDefault();
      const { productId } = e.target.dataset;
      // console.log(productId);
      cartRemoveOne(productId);
    });
  });

/**------------------------------------------------------------------- */

const checkoutForm = document.getElementById('checkoutForm');
checkoutForm.addEventListener('submit', processCheckout, false);

function processCheckout(e) {
  e.preventDefault();
  let handler = PaystackPop.setup({
    key: 'pk_test_41e8b4543e36edb3c80b25a2385148fdda3d20c1',
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    amount: document.getElementById('amount').value * 100,
    ref: '' + Math.floor(Math.random() * 1000000000 + 1),
    // label: "Optional string that replaces customer email"
    onClose: function() {
      showAlert('error', `Your order has been cancelled`);
      window.setTimeout(() => {
        location.assign('/cart');
      }, 1500);
    },
    callback: async function(response) {
      try {
        const userId = document.getElementById('userId').value;
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const price = document.getElementById('amount').value;
        const totalQty = document.getElementById('totalQty').value;

        const itemNames = document.querySelectorAll('.item-name');
        const itemName = Array.from(itemNames).map(input => input.value);
        const itemQtys = document.querySelectorAll('.item-qty');
        const itemQty = Array.from(itemQtys).map(input => input.value);
        const itemPrices = document.querySelectorAll('.item-price');
        const itemPrice = Array.from(itemPrices).map(input => input.value);
        // console.log(itemName, itemQty, itemPrice);

        // console.log(itemName, itemQty);
        await axios({
          method: 'POST',
          url: `/api/v1/orders/`,
          data: {
            name,
            address,
            price,
            itemName,
            itemQty,
            itemPrice,
            totalQty,
            userId
          }
        });
        // console.log(response);
        if (response.status === 'success') {
          showAlert(
            'success',
            `Your order has been recieved, and is being processed you'll be contacted shortly`
          );
          window.setTimeout(() => {
            location.assign('/products');
          }, 1500);
        }
      } catch (err) {
        showAlert('error', response.message);
      }
    }
  });
  handler.openIframe();
}

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', payForBooking, false);
