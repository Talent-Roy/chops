const mongoose = require('mongoose');
const slugify = require('slugify');

const JobSchema = new mongoose.Schema(
  {
    slug: String,
    title: {
      type: String,
      required: [true, 'A job must have a title']
    },
    coverImage: {
      type: String,
      required: [true, 'a job must have a cover image']
    },
    category: {
      type: String,
      required: [true, 'What type of job is this?']
    },
    description: {
      type: String,
      required: [true, 'Please describe this job.'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'A job must have an excution address']
    },
    budget: {
      type: Number,
      required: [true, 'A job must have a budget']
    },
    images: [String],
    beginDate: {
      type: Date,
      required: [true, 'A job must have a beginning date']
    },
    finishDate: {
      type: Date
    },
    jobDuration: {
      type: String,
      required: [true, ' A job must have a an expected duration']
    },
    secretJob: {
      type: Boolean,
      default: false
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
  ref: 'JobBid',
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
