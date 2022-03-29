const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/UserModel');
const cloudinary = require('../utils/cloudinaryConfig');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/user');
//   },
//   filename: (req, file, cb) => {
//     //user-36366458dsk-5356777.jpg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

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

exports.uploadUserPhoto = upload.single('photo');

let result;

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `public/img/user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(req.file.filename);

  try {
    result = await cloudinary.uploader.upload(req.file.filename);
    console.log(result, res);
  } catch {
    console.log(
      'Problem uploading images, please check your network connection.'
    );
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update please use the /updatemypassword route',
        400
      )
    );
  }
  //2)filter out unwanted fields
  /**
   * we filter the body because we dont want the user user to manipulate
   * other data in the body like the roles when updating , so we specify
   * the only body properties that can be updated
   */
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = result.secure_url;
  if (req.cloudinaryId) req.cloudinaryId = result.public_id;

  //3)update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined! Please use /signup instead!'
  });
};

exports.getAllUsers = factory.getAll(User, { path: 'orders' });
exports.getUser = factory.getOne(User, { path: 'orders' });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
