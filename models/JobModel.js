const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const JobSchema = new mongoose.Schema(
  {
    slug: String,
    address: {
      type: String,
      required: [true, 'A job must have an excution address']
    },
    description: {
      type: String,
      required: [true, 'Please describe this job.'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'a job must have a cover image']
    },
    images: [String],
    jobDate: {
      type: Date,
      required: [true, 'A job must have a beginning date']
    },
    email: {
      type: String,
      required: [true, 'please provide an email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    phoneNum: {
      type: String,
      required: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    //GeoJSON
    location: [
      {
        type: {
          type: String,
          default: 'point',
          enum: ['point']
        },
        //coordinates: logitude 1st before Latitude
        coordinates: [Number],
        description: String
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

JobSchema.index({ price: 1, features: 1 });
JobSchema.index({ slug: 1 });
JobSchema.index({ location: '2dsphere' });

/**
 * Virtual populate
 */
JobSchema.virtual('bids', {
  ref: 'JobReview',
  foreignField: 'Job',
  localField: '_id'
});

/**
 * Document middleware
 */
JobSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

/**
 * Query middleware
 */
JobSchema.pre(/^find/, function(next) {
  this.find({ secretJob: { $ne: true } });

  this.start = Date.now();
  next();
});

JobSchema.post(/^find/, function(next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
});

/**TODO: write a function that checks if geoNear is the first
 *  stage in the pipeline, if it is, the we remove this one and make it second ⏲  */
// JobSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretJob: { $ne: true } } });
//   next();
// });

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
