const express = require('express');
const { addToCart, removeByOne } = require('../controllers/cartController');

const router = express.Router();

router.post('/add-to-cart/:id', addToCart);

router.post('/reduce-by-one/:id', removeByOne);

module.exports = router;
