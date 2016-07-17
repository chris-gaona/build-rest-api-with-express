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
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: String,
    description: String
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;