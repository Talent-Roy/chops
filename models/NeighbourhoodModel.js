const mongoose = require('mongoose');
const slugify = require('slugify');
// const Homes = require('./HomeModel');

const NeighbourhoodSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'A neighbourhood must have a name!']
    },
    state: {
      type: String,
      required: [true, 'A neighbourhood must be in a state']
    },
    coverImage: {
      type: String,
      required: [true, 'A neighbourhood must have a cover image']
    },
    images: [String],
    description: {
      type: String,
      trim: true,
      required: [true, 'A neighbourhood must have a description']
    },
    features: {
      schools: {
        names: [String],
        images: [String]
      },
      churches: {
        names: [String],
        images: [String]
      },
      mosques: {
        names: [String],
        images: [String]
      },
      parks: {
        names: [String],
        images: [String]
      },
      malls: {
        names: [String],
        images: [String]
      },
      hangouts: {
        names: [String],
        images: [String]
      },
      streets: {
        names: [String],
        images: [String]
      }
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 1.0'],
      max: [5, 'A rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
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
    ],
    homes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Home'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//indexing
NeighbourhoodSchema.index({ features: 1, averageRating: -1 });
NeighbourhoodSchema.index({ slug: 1 });
NeighbourhoodSchema.index({ location: '2dsphere' });

//slugify the doc
NeighbourhoodSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * virtual populate
 */

NeighbourhoodSchema.virtual('reviews', {
  ref: 'NeighbourhoodReview',
  foreignField: 'neighbourhood',
  localField: '_id'
});
/**
 * for embeding documents(here you need to require the model in this document)
 */

// NeighbourhoodSchema.pre('save', async function(next) {
//   const homesPromises = this.homes.map(async id => await Homes.findById(id));
//   this.homes = await Promise.all(homesPromises);
//   next();
// });

/**
 * Query middlewares
 */
NeighbourhoodSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'homes',
    select: '-__v -createdAt'
  });
  next();
});

const Neighbourhood = mongoose.model('Neighbourhood', NeighbourhoodSchema);

module.exports = Neighbourhood;
