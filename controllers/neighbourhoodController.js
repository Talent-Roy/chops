const Neighbourhood = require('../models/NeighbourhoodModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasTopNeighbourhoods = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-averageRating';
  req.query.fields =
    'averageRating, name, features, ratingsQuantity, state, description';
  next();
};

exports.getAllNeighbourhoods = factory.getAll(Neighbourhood);

exports.createNeighbourhood = factory.createOne(Neighbourhood);

exports.getSingleNeighbourhood = factory.getOne(Neighbourhood, {
  path: 'reviews'
});

exports.updateNeighbourhood = factory.updateOne(Neighbourhood);

exports.deleteNeighbourhood = factory.deleteOne(Neighbourhood);

exports.getNeighbourhoodStats = catchAsync(async (req, res, next) => {
  const stats = await Neighbourhood.aggregate([
    {
      $match: { averageRating: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$name' },
        numNeighbourhoods: { $sum: 1 },
        numRatings: { $sum: 'ratingsQuantity' },
        avgRating: { $avg: '$averageRating' }
      }
    },
    {
      $sort: { avgRating: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Neighbourhood stats',
    data: {
      stats
    }
  });
});

// /neighbourhoods-within/:distance/center/:latlng/unit/:unit
// /neighbourhoods-within/233/center/34.111745,-118.113491/unit/mi
exports.getNeighbourhoodsWithin = catchAsync(async (req, res, next) => {
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

  const neighbourhoods = await Neighbourhood.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: neighbourhoods.length,
    data: {
      data: neighbourhoods
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

  const distances = await Neighbourhood.aggregate([
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
