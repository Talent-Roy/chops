const NeighbourhoodReview = require('../models/NeighbourhoodReviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setNeighbourhoodUserId = (req, res, next) => {
  //allow nested routes when not specified in the request body
  if (!req.body.neighbourhood)
    req.body.neighbourhood = req.params.neighbourhoodId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(NeighbourhoodReview);

exports.createReview = factory.createOne(NeighbourhoodReview);

exports.getReview = factory.getOne(NeighbourhoodReview);

exports.updateReview = factory.updateOne(NeighbourhoodReview);

exports.deleteReview = factory.deleteOne(NeighbourhoodReview);
