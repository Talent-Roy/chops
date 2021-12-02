const Review = require('../models/ReviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setReviewUserId = (req, res, next) => {
  //allow nested routes when not specified in the request body
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user;
  // console.log(req.body.user);
  // console.log(req.params.productId);
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
