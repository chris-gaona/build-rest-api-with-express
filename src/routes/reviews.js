'use strict';

var express = require('express');
var router = express.Router();

var courses = require('../data/data.json');

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', function (req, res, next) {
  res.status(201).json('You sent a POST request to create a new review');
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', function (req, res, next) {
  res.status(204).json('You sent a DELETE request to delete a review: ' + req.params.id);
});

module.exports = router;
