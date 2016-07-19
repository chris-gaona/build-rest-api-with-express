'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');
var User = require('../models/users');

var courses = require('../data/data.json');

var auth = require('../auth.js');

//creates middleware for all post urls to go through first
router.param('id', function(req, res, next, id) {
  var query = Course.findById(id).populate('reviews');

  query.exec(function(err, course) {
    if (err) {return next(err)}

    if(!course) {
      return next(new Error('can\'t find course'));
    }

    req.course = course;
    return next();
  });
});

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function (req, res, next) {
  Course.find(function (err, courses) {
    if(err) return next(err);
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
    if(err) return next(err);

    var oneCourse = {};
    oneCourse.data = [];
    oneCourse.data.push(course);
    res.json(oneCourse);
  });
});

// POST /api/courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', auth, function (req, res, next) {
  var course = new Course(req.body);

  course.save(function (err) {
    console.log(err);
    if (err) {
      if (err.name === 'ValidationError') {
        if (err.errors.title) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.title.message } ] }
          });
        } else if (err.errors.description) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.description.message } ] }
          });
        } else if (err.errors.steps) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.steps.message } ] }
          });
        }
      } else {
        return next(err);
      }
    }
    res.status(201);
    res.end();
  });
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', auth, function (req, res, next) {
  req.course.update(req.body, { runValidators: true }, function(err, course) {
    console.log(err);
    if (err) {
      if (err.name === 'ValidationError') {
        if (err.errors.title) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.title.message } ] }
          });
        } else if (err.errors.description) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.description.message } ] }
          });
        } else if (err.errors.steps) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.steps.message } ] }
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

module.exports = router;
