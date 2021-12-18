const User = require('../models/UserModel');
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

//render homepage
exports.getHome = catchAsync(async (req, res, next) => {
  const topPick = await Product.find()
    .limit(1)
    .sort({ ratingsAverage: -1, price: -1 });
  const topProducts = await Product.find()
    .limit(4)
    .sort({ ratingsAverage: -1, price: -1 });

  res.status(200).render('home', {
    title: 'Home page',
    topProducts,
    topPick
  });
});

/**
 * products----------------------------------------------------
 */

//render homepage
exports.createProduct = catchAsync(async (req, res, next) => {
  res.status(200).render('createproduct', {
    title: 'Create product'
  });
});

//get all available products forsale
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find(req.query).sort({ createdAt: -1 });

  res.status(200).render('products', {
    title: 'All products',
    products
  });
});

//get a product detail and populate with reviews
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!product) {
    return next(new AppError('There is no product with that name.', 404));
  }
  const { reviews } = product;

  // console.log(reviews);
  res.status(200).render('product', {
    title: `${product.name}`,
    product,
    reviews
  });
});

//update product
exports.updateProductData = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.product.id,
    {
      price: req.body.price,
      description: req.body.description
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('product', {
    title: `${updatedProduct.name}`,
    product: updatedProduct
  });
});

/**------------------------------------------------------------------------- */

/**orders------------------------------------------------------------------- */

exports.getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  // console.log(orders);

  res.status(200).render('orders', {
    title: 'All users orders',
    orders
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.find({ id: req.params._id }).sort({
    createdAt: -1
  });

  // console.log(order);

  res.status(200).render('order', {
    title: 'Order details',
    order
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.userId }).sort({
    createdAt: -1
  });
  // console.log(orders);
  res.status(200).render('orders', {
    title: 'All your orders',
    orders
  });
});

/**------------------------------------------------------------------------- */

/**---------------------------------------------------------------------------- */
exports.getReviewForm = (req, res) => {
  res.status(200).render('post-review', {
    title: 'Review'
  });
};

exports.getCart = catchAsync(async (req, res) => {
  if (!req.session.cart) {
    return res.render('cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  // console.log(cart);
  res.status(200).render('cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

exports.getCheckout = catchAsync(async (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/cart');
  }
  const cart = new Cart(req.session.cart);
  console.log(cart.items);
  res.status(200).render('checkout', {
    total: cart.totalPrice,
    qty: cart.totalQty,
    products: cart.generateArray()
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup'
  });
};

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
  // console.log(req.user);
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('users', {
    title: 'All Users',
    users
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ slug: req.params.slug });

  if (!user) {
    return next(new AppError('There is no user with that name.', 404));
  }

  res.status(200).render('user', {
    title: `${user.name}`,
    user
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
