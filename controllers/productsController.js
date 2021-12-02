const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/ProductModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

//check if uploaded file is an image
//if (img) we pass = true if(!img) we pass = false + error
//also works for all filetypes
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductImages = upload.array('images', 3);

/**
 when its 1 image we use
 // upload.single('image') req.file
 when it's more than 1 image
// upload.array('images', 5) req.files
when it's mixed e.g 1 + more we use
//upload.fields([{}])
 */

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  // 2) Images
  req.body.images = [];
  console.log(req.files);

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${req.body.slug}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, category, summary ';
  next();
};

// exports.setProductId = (req, res, next) => {
//   //allow nested routes when not specified in the request body
//   if (!req.body.user) req.body.user = req.user.id;
//   // console.log(req.user.id);
//   next();
// };

exports.getAllProducts = factory.getAll(Product, { path: 'reviews' });

exports.createProduct = factory.createOne(Product);

exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews users'
  });

  // console.log(product);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// exports.getSingleProduct = factory.getOne(Product, { path: 'engineer, reviews' });

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numProducts: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
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
    message: 'Product stats',
    data: {
      stats
    }
  });
});
