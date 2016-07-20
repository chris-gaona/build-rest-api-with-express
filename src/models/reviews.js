/**
* @module Reviews Model
*/

'use strict';

/**
* Requires the mongoose model
* @requires mongoose
*/
var mongoose = require('mongoose');

// Review
// _id (ObjectId, auto-generated)
// user (_id from the users collection)
// postedOn (Date)
// rating (Number)
// review (String)

// creates Review mongoose schema
var ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: String
});

var Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
