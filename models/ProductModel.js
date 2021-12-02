const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const ProductSchema = new mongoose.Schema(
  {
    slug: String,
    name: {
      type: String
    },
    category: {
      type: String
    },
    quantity: {
      type: Number,
      min: [1, 'Quantity can not be less than one.'],
      default: 1
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    description: {
      type: String,
      trim: true
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ProductSchema.index({ slug: 1 });

/**
 * Virtual populate : get reviews on products
 */

ProductSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

/**
 * Document middleware
 */
ProductSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * Query middleware
 */

// ProductSchema.pre(/^find/, function(next) {
//   this.find({ secretproduct: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

ProductSchema.post(/^find/, function(next) {
  console.log(`query took  ${Date.now() - this.start} milliseconds`);
});

/**TODO: write a function that checks if geoNear is the first
 *  stage in the pipeline, if it is, the we remove this one and make it second ⏲  */

// ProductSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretproduct: { $ne: true } } });
//   next();
// });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
