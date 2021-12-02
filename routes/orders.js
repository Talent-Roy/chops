const express = require('express');
const {
  createOrder,
  getAllOrders,
  setOrderUserId,
  getSingleOrder
} = require('../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .get(setOrderUserId, getAllOrders)
  .post(createOrder);

router.get('/:id', getSingleOrder);

module.exports = router;
