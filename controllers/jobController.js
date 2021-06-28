const Job = require('../models/JobModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopJobs = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-averageRating';
  req.query.fields =
    'title, price, averageRating, listedFor, category, features';
  next();
};

exports.getAllJobs = factory.getAll(Job);

exports.createJob = factory.createOne(Job);

exports.getSingleJob = factory.getOne(Job, { path: 'reviews' });

exports.updateJob = factory.updateOne(Job);

exports.deleteJob = factory.deleteOne(Job);

exports.getJobStats = catchAsync(async (req, res, next) => {
  const stats = await Job.aggregate([
    {
      $match: { averageRating: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numJobs: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$averageRating' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Job stats',
    data: {
      stats
    }
  });
});

// /Jobs-within/:distance/center/:latlng/unit/:unit
// /Jobs-within/233/center/34.111745,-118.113491/unit/mi
exports.getJobsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }

  const jobs = await Job.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      data: jobs
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Job.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
