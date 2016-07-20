'use strict';

var mongoose = require('mongoose');

// Course
// _id (ObjectId, auto-generated)
// user (_id from the users collection)
// title (String)
// description (String)
// estimatedTime (String)
// materialsNeeded (String)
// steps (Array of objects that include stepNumber (Number), title (String) and description (String) properties)
// reviews (Array of ObjectId values, _id values from the reviews collection)

var CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  usersWhoReviewed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

CourseSchema.path('steps').validate(function(steps){
    if (!steps) {
      return false;
    } else if (steps.length === 0) {
      return false;
    }
    return true;
}, 'Steps needs to have at least one feature');

// Update the Course schema with an overallRating virtual property.
// overallRating is a calculated, read only property that returns the average of all of the review ratings for this course rounded to the nearest whole number.
// By not storing this calculated value in the database, we ensure that it's impossible for the value to get out of sync with the course's reviews.
CourseSchema.virtual('overallRating').get(function () {
  var total = 0;
  for (var i = 0; i < this.reviews.length; i++) {
    total += this.reviews[i].rating;
  }
  return Math.ceil(total / this.reviews.length);
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
