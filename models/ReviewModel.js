const mongoose = require('mongoose');
const Product = require('./ProductModel');

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'please let us know what you think of this product']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'A review must be of a product!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, ' A review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//prevent duplicate reviews from the same user
// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

/**
 * Query middlewares
 */

//populating reviews with the product-reviewed & review owner
ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

ReviewSchema.statics.calcAverageRatings = async function(Review) {
  const stats = await this.aggregate([
    {
      $match: { product: Review }
    },
    {
      $group: {
        _id: '$product',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(Review, {
      ratingsQuantity: stats[0].numRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await Product.findByIdAndUpdate(Review, {
      ratingsQuantity: 0,
      averageRating: 4.5
    });
  }
};

ReviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

ReviewSchema.pre(/^findOneAnd/, async function(next) {
  /**we execute this querry to get access to the current document and 
 store it on the query variable (this) so we can use it in the post 
 middleware which is where we do the actuall calculation*/
  this.jr = await this.findOne();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function() {
  /**awaiting this.findOne  in the post middleware will not work here without the
  above code because the query would have already executed*/
  await this.gd.constructor.calcAverageRatings(this.jr.product);
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
