'use strict';

var express = require('express');
var router = express.Router();

var courses = require('./data/data.json');

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

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function (req, res, next) {
  res.json('You sent a GET request to find the current user');
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function (req, res, next) {
  res.status(201).json('You sent a POST request to create a new user');
});

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', function (req, res, next) {
  res.status(201).json('You sent a POST request to create a new review');
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', function (req, res, next) {
  res.status(204).json('You sent a DELETE request to delete a review: ' + req.params.id);
});

module.exports = router;
