const mongoose = require('mongoose');
const Neighbourhood = require('./NeighbourhoodModel');

const NeighbourhoodReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    neighbourhood: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Neighbourhood',
        required: [true, 'A neighbourhood review must be of a neighbourhood!']
      }
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user!']
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//prevent duplicate reviews from the same user
NeighbourhoodReviewSchema.index({ home: 1, user: 1 }, { unique: true });

/**
 * Query middlewares
 */
NeighbourhoodReviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'neighbourhood',
  //   select: '-__v -createdAt'
  // });
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

NeighbourhoodReviewSchema.statics.calcAverageRatings = async function(
  neighbourhoodId
) {
  const stats = await this.aggregate([
    {
      $match: { neighbourhood: neighbourhoodId }
    },
    {
      $group: {
        _id: '$neighbourhood',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Neighbourhood.findByIdAndUpdate(neighbourhoodId, {
      ratingsQuantity: stats[0].numRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await Neighbourhood.findByIdAndUpdate(neighbourhoodId, {
      ratingsQuantity: 0,
      averageRating: 4.5
    });
  }
};

NeighbourhoodReviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.neighbourhood);
});

NeighbourhoodReviewSchema.pre(/^findOneAnd/, async function(next) {
  /**we execute this querry to get access to the current document and 
 store it on the query variable (this) so we can use it in the post 
 middleware which is where we do the actuall calculation*/
  this.hr = await this.findOne();
  next();
});

NeighbourhoodReviewSchema.post(/^findOneAnd/, async function() {
  /**awaiting this.findOne  in the post middleware will not work here without the
  above code because the query would have already executed*/
  await this.hr.constructor.calcAverageRatings(this.hr.neighbourhood);
});

const NeighbourhoodReview = mongoose.model(
  'NeighbourhoodReview',
  NeighbourhoodReviewSchema
);

module.exports = NeighbourhoodReview;
