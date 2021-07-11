const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

require('dotenv').config();

/**connect to database */
const DB = process.env.MONGODB_URI || process.env.DATABASE_PROD;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .catch(err => console.log(err))
  .then(console.log('connected to database'));

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * Global middlewares
 */

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set headers
app.use(helmet());

//set env variable for logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//limit number of requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//body parser for reading data from req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//express urlencoded middleware
app.use(express.urlencoded({ extended: false }));

//prevent parameter pollution
app.use(
  hpp({
    whitelist: ['job', 'completed', 'budget']
  })
);

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
/**
 * Routes
 */

app.use('/', require('./routes/views'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/jobs', require('./routes/jobs'));
app.use('/api/v1/job-bids', require('./routes/jobbids'));
app.use('/api/v1/neighbourhoods', require('./routes/neighbourhoods'));
app.use('/api/v1/neighbourhoodreview', require('./routes/neighbourhoodReview'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
