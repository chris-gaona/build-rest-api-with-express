'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');
var User = require('../models/users');

var courses = require('../data/data.json');

var auth = require('../auth.js');

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', auth, function (req, res, next) {
  var review = new Review(req.body);
  review.save(function (err) {
    console.log(err);
    if (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.rating.message } ] }
        });
      } else {
        return next(err);
      }
    }
    res.status(201);
    res.end();
  });
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', auth, function (req, res, next) {
  res.status(204).json('You sent a DELETE request to delete a review: ' + req.params.id);
});

module.exports = router;
