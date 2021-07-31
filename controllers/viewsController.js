const Job = require('../models/JobModel');
const User = require('../models/UserModel');
const Booking = require('../models/BookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getHome = catchAsync(async (req, res, next) => {
  // // 1) Get job data from collection
  // const jobs = await Job.find();

  // 2) Build template
  // 3) Render that template using job data from 1)
  res.status(200).render('home', {
    title: 'All Jobs'
    // jobs
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested job (including reviews and guides)
  const job = await Job.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!job) {
    return next(new AppError('There is no job with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('job', {
    title: `${job.name} job`,
    job
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyJobs = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find jobs with the returned IDs
  const jobIDs = bookings.map(el => el.job);
  const jobs = await Job.find({ _id: { $in: jobIDs } });

  res.status(200).render('my-jobs', {
    title: 'My jobs',
    jobs
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
