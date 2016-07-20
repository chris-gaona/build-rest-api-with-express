'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var User = require('../models/users');

var auth = require('../auth.js');

// creates middleware for all post urls to go through first
router.param('id', function (req, res, next, id) {
  var query = Course.findById(id).populate('reviews');

  query.exec(function (err, course) {
    if (err) { return next(err); }

    if (!course) {
      return next(new Error('can\'t find course'));
    }

    req.course = course;
    return next();
  });
});

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function (req, res, next) {
  Course.find({}, '_id title reviews', function (err, courses) {
    if (err) return next(err);

    var allCourses = {};
    allCourses.data = courses;
    res.json(allCourses);
  });
});

// GET /api/courses/:id 200 - Returns all Course properties and related documents for the provided course ID
router.get('/courses/:id', function (req, res, next) {
  var options = [
    { path: 'reviews.user' },
    { path: 'user' }
  ];

  User.populate(req.course, options, function (err, course) {
    if (err) return next(err);

    var oneCourse = {};
    oneCourse.data = [];
    oneCourse.data.push(course);
    res.json(oneCourse);
  });
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', auth, function (req, res, next) {
  var course = new Course(req.body);
  course.usersWhoReviewed.push(req.user);

  course.save(function (err) {
    console.log(err);
    if (err) {
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
        return next(err);
      }
    }
    res.status(201);
    res.location('/courses/' + course._id);
    res.end();
  });
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', auth, function (req, res, next) {
  req.course.update(req.body, { runValidators: true }, function (err, course) {
    console.log(err);
    if (err) {
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
        return next(err);
      }
    }

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
