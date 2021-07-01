const AppError = require('../utils/appError');

const handleDBCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid Token, please login again', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired, please log in again');

const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProduction = (err, res) => {
  //response when error is an operational or predicted type of error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    /*send response when error is a programming or an unknown 
    error and details shouldn't be leaked to the client*/
  } else {
    //log error
    console.error('ERROR', err),
      //send generic message
      res.status(500).json({
        status: 'error',
        message: err.message,
        stack: err.stack
      });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleDBCastError(error);

    if (error.code === 11000) error = handleDuplicateFieldDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'jsonWebTokenError') error = handleJwtError(error);

    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);

    sendErrorProduction(error, res);
  }
};
