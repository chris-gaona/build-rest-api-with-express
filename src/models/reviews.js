'use strict';

var mongoose = require('mongoose');

// Review
// _id (ObjectId, auto-generated)
// user (_id from the users collection)
// postedOn (Date)
// rating (Number)
// review (String)

var ReviewSchema = new mongoose.Schema({
  user: UserSchema,
  postedOn: Date,
  rating: Number,
  review: String
});

var Review = mongoose.model('ReviewSchema', ReviewSchema);

module.exports.Review = Review;
