const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFEATURES = require('../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: false
      });
      // console.log(req.params, req.body);
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        message: 'updated document',
        data: {
          data: doc
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'created a new document',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    // console.log(populateOptions);
    const doc = await query;
    // console.log(doc);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //small hack to allow nested routes to get reviews
    let filter = {};
    if (req.params.productId || req.params.userId)
      filter = {
        products: req.params.productId,
        user: req.params.userId
      };

    const features = new APIFEATURES(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // console.log(doc);

    res.status(200).json({
      status: 'success',
      message: 'A collection of all listed documents',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
