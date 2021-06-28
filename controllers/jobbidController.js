const JobBid = require('../models/JobBidModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setBidUserId = (req, res, next) => {
  //allow nested routes when not specified in the request body
  if (!req.body.job) req.body.job = req.params.jobId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllBids = factory.getAll(JobBid);

exports.createBid = factory.createOne(JobBid);

exports.getBid = factory.getOne(JobBid);

exports.updateBid = factory.updateOne(JobBid);

exports.deleteBid = factory.deleteOne(JobBid);
