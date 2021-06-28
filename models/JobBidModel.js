const mongoose = require('mongoose');
const Job = require('./JobModel');

const JobBidSchema = new mongoose.Schema(
  {
    bid: {
      type: String,
      trim: true,
      required: [
        true,
        'Please let the owner of this job know why you are perfet for this project'
      ]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    Job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: [true, 'A Job bid must be of a list Job!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, ' A bid must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//prevent duplicate bids from the same user
JobBidSchema.index({ Job: 1, user: 1 }, { unique: true });

/**
 * Query middlewares
 */
JobBidSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'Job',
  //   select: '-__v -createdAt'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

JobBidSchema.statics.calcAverageRatings = async function(jobId) {
  const stats = await this.aggregate([
    {
      $match: { job: jobId }
    },
    {
      $group: {
        _id: '$job',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Job.findByIdAndUpdate(jobId, {
      ratingsQuantity: stats[0].numRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await Job.findByIdAndUpdate(jobId, {
      ratingsQuantity: 0,
      averageRating: 4.5
    });
  }
};

JobBidSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.job);
});

JobBidSchema.pre(/^findOneAnd/, async function(next) {
  /**we execute this querry to get access to the current document and 
 store it on the query variable (this) so we can use it in the post 
 middleware which is where we do the actuall calculation*/
  this.hr = await this.findOne();
  next();
});

JobBidSchema.post(/^findOneAnd/, async function() {
  /**awaiting this.findOne  in the post middleware will not work here without the
  above code because the query would have already executed*/
  await this.hr.constructor.calcAverageRatings(this.hr.job);
});

const JobBid = mongoose.model('JobBid', JobBidSchema);

module.exports = JobBid;
