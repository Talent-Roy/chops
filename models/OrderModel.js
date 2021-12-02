const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, ' An order must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Your name is required']
  },
  address: {
    type: String,
    required: [true, 'Your address is required']
  },
  itemName: {
    type: [String],
    required: [true, 'please what did you order for?']
  },
  itemQty: {
    type: [String],
    required: [true, 'please how many of an item did you order for?']
  },
  itemPrice: {
    type: [Number],
    required: [true, 'what are the prices of the single items']
  },
  totalQty: {
    type: String,
    required: [true, 'please specify your billing address']
  },
  price: {
    type: Number,
    required: [true, 'An order must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
