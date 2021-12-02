// const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const AppError = require('../utils/appError');

exports.addToCart = (req, res, next) => {
  const productId = req.params.id;
  // console.log(req.params);
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      next(new AppError('Theres no product with that id'));
    }
    cart.add(product, product.id);
    req.session.cart = cart;

    res.status(200).json({
      status: 'success',
      message: 'All your cart items',
      results: cart.length,
      data: {
        data: cart
      }
    });
  });
};

exports.removeByOne = (req, res, next) => {
  const productId = req.params.id;
  // console.log(req.params);
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;

  res.status(200).json({
    status: 'success',
    message: 'All your cart items',
    results: cart.length,
    data: {
      data: cart
    }
  });
};
