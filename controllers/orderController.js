const factory = require('./handlerFactory');
const Order = require('../models/OrderModel');
const catchAsync = require('../utils/catchAsync');

exports.setOrderUserId = (req, res, next) => {
  //allow nested routes when not specified in the request body
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.user.id);
  next();
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'created a new document',
    data: {
      data: order
    }
  });

  //   console.log(req.session);
  //   req.session.cart = null;
  //   console.log(req.session);
});

exports.getSingleOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
