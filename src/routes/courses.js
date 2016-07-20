/**
* @module Courses Routes
*/

'use strict';

/**
* Requires the express module
* @requires express
*/
var express = require('express');
// creates express router
var router = express.Router();

/**
* Requires the Course Mongoose model
* @requires Course Mongoose model
*/
var Course = require('../models/courses');
/**
* Requires the User Mongoose model
* @requires User Mongoose model
*/
var User = require('../models/users');
/**
* Requires the auth module
* @requires auth module
*/
var auth = require('../auth.js');

// creates middleware for all course urls to go through first
router.param('id', function (req, res, next, id) {
  // populates reviews in Course model
  var query = Course.findById(id).populate('reviews');

  // executes the query
  query.exec(function (err, course) {
    // if err pass the error onto the next error handler
    if (err) { return next(err); }

    // if there is no course return error to error handler saying can't find the course
    if (!course) {
      return next(new Error('can\'t find course'));
    }

    // sets course to req.course to be passed to next handler
    req.course = course;
    return next();
  });
});

// GET /api/courses 200
router.get('/courses', function (req, res, next) {
  // Returns the Course "_id" and "title" and "reviews" properties
  Course.find({}, '_id title reviews', function (err, courses) {
    // if error pass it along to error handler
    if (err) return next(err);

    // fixes up data to be used by Angular client side
    var allCourses = {};
    allCourses.data = courses;
    // send json response
    res.json(allCourses);
  });
});

// GET /api/courses/:id 200
router.get('/courses/:id', function (req, res, next) {
  // creates options array for paths that I want populated
  var options = [
    { path: 'reviews.user' },
    { path: 'user' }
  ];

  // Returns all Course properties and related documents for the provided course ID
  User.populate(req.course, options, function (err, course) {
    // if error send it to the error handler
    if (err) return next(err);

    // fixes up data to be used by Angular client side
    var oneCourse = {};
    oneCourse.data = [];
    oneCourse.data.push(course);
    // send json response
    res.json(oneCourse);
  });
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', auth, function (req, res, next) {
  // create new Course using req.body
  var course = new Course(req.body);
  // push current user to usersWhoReviewed so user cannot review their own course
  course.usersWhoReviewed.push(req.user);

  // save the course
  course.save(function (err) {
    // if errors
    if (err) {
      // check for validation errors
      if (err.name === 'ValidationError') {
        if (err.errors.title) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.title.message } ] }
          });
        } else if (err.errors.description) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.description.message } ] }
          });
        } else if (err.errors.steps) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.steps.message } ] }
          });
        } else if (err.errors['steps.0.title']) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Steps - title is required' } ] }
          });
        } else if (err.errors['steps.0.description']) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Steps - description is required' } ] }
          });
        }
      } else {
        // else send the error to the error handler
        return next(err);
      }
    }
    res.status(201);
    // sets Location header
    res.location('/courses/' + course._id);
    res.end();
  });
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', auth, function (req, res, next) {
  // updates the course found with req.body
  // runValidators set to true to add the validation to the upates like it was a new course
  req.course.update(req.body, { runValidators: true }, function (err, course) {
    // if error
    if (err) {
      // check for validatin errors
      if (err.name === 'ValidationError') {
        if (err.errors.title) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.title.message } ] }
          });
        } else if (err.errors.description) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.description.message } ] }
          });
        } else if (err.errors.steps) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.steps.message } ] }
          });
        }
      } else {
        // else send the error to the error handler
        return next(err);
      }
    }
    // send 204 status
    res.status(204);
    res.end();
  });
});

/** *******************/
// Unsupported HTTP Verbs
/** *******************/

// /api/courses
// PUT 403 - Cannot edit a collection of courses.
router.put('/courses', function (req, res, next) {
  res.status(403).json({message: 'Cannot edit a collection of courses.'});
});

// DELETE 403 - Cannot delete a collection of courses.
router.delete('/courses', function (req, res, next) {
  res.status(403).json({message: 'Cannot delete a collection of courses.'});
});

// /api/courses/:id
// POST 405 - Use the '/api/courses' route to create a course.
// Also include an Allow header with the value GET,PUT
router.post('/courses/:id', function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, PUT');
  res.status(405).json({message: 'Use the "/api/courses" route to create a course.'});
});

// DELETE 403 - Cannot delete a course.
router.delete('/courses', function (req, res, next) {
  res.status(403).json({message: 'Cannot delete a course.'});
});

module.exports = router;
