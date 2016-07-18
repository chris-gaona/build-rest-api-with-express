'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');
var User = require('../models/users');

var courses = require('../data/data.json');

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
router.post('/courses', function (req, res, next) {
  res.status(201).json('You sent a POST request to create a new course');
});

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/courses/:id', function (req, res, next) {
  res.status(204).json('You sent a PUT request to update a course: ' + req.params.id);
});

module.exports = router;
