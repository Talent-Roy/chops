const JobReview = require('../models/JobReviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setReviewsUserId = (req, res, next) => {
  //allow nested routes when not specified in the request body
  if (!req.body.job) req.body.job = req.params.jobId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(JobReview);

exports.createReview = factory.createOne(JobReview);

exports.getReview = factory.getOne(JobReview);

exports.updateReview = factory.updateOne(JobReview);

exports.deleteReview = factory.deleteOne(JobReview);
