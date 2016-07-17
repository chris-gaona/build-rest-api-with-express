'use strict';

var express = require('express');
var router = express.Router();

var courses = require('../data/data.json');

// GET /api/courses 200 - Returns the Course "_id" and "title" properties
router.get('/courses', function (req, res, next) {
  // Update the GET /api/courses route to return static data.
  // Return an array of object literals with "_id" and "title" properties
  var allCourses = {};
  var data = [];
  allCourses.data = data;
  allCourses.data.push(courses.courses.one);
  allCourses.data.push(courses.courses.two);
  res.json(allCourses);
});

// GET /api/courses/:id 200 - Returns all Course properties and related documents for the provided course ID
router.get('/courses/:id', function (req, res, next) {
  res.json('You sent a GET request for a specific course: ' + req.params.id);
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
