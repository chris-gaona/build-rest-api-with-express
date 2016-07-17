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
  user: UserSchema,
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String,
  steps: [],
  reviews: []
});

var Course = mongoose.model('CourseSchema', CourseSchema);

module.exports.Course = Course;
