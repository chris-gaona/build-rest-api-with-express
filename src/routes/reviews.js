/**
* @module Reviews Routes
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
var Review = require('../models/reviews');
/**
* Requires the auth module
* @requires auth module
*/
var auth = require('../auth.js');

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', auth, function (req, res, next) {
  // creates a new review using req.body
  var review = new Review(req.body);
  // assigns req.user from auth module to review.user
  review.user = req.user;

  // find one course with specific course id
  // return only reviews & usersWhoReviewed
  Course.findOne({_id: req.params.courseId}, 'reviews usersWhoReviewed', function (err, course) {
    // if error send to the error handler
    if (err) { return next(err); }

    // if the user has already wrote a review for the current course
    if (course.usersWhoReviewed.indexOf(review.user._id) !== -1) {
      // return a validation error
      return res.status(400).json({
        message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Sorry, you have already posted a review for this course' } ] }
      });
    } else {
      // else push the new review into Course.reviews
      course.reviews.push(review);
      // make sure the user cannot write another review
      course.usersWhoReviewed.push(review.user);
      // save the course
      course.save(function (err) {
        // if error pass to error handler
        if (err) { return next(err); }
      });

      // save the review
      review.save(function (err) {
        // if any errors
        if (err) {
          // check for validation errors
          if (err.name === 'ValidationError') {
            return res.status(400).json({
              message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.rating.message } ] }
            });
          } else {
            // else send error to error handler
            return next(err);
          }
        }
        // send 201 status
        res.status(201);
        // sets Location header
        res.location('/courses/' + course._id);
        res.end();
      });
    }
  });
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', auth, function (req, res, next) {
  // remove the review that matches the id in url
  Review.remove({_id: req.params.id}, function (err) {
    // if error send to error handler
    if (err) { return next(err); }
  });

  // find specific course that matches course id in url
  // return only reviews & usersWhoReviewed
  Course.findOne({_id: req.params.courseId}, 'reviews usersWhoReviewed', function (err, course) {
    // if error send to error handler
    if (err) { return next(err); }

    // splice out the deleted review from course.reviews array
    course.reviews.splice(course.reviews.indexOf(req.params.id), 1);
    // splice out the deleted review user from course.usersWhoReviewed array
    course.usersWhoReviewed.splice(course.usersWhoReviewed.indexOf(req.user), 1);

    // save the course
    course.save(function (err) {
      // if error send to error handler
      if (err) { return next(err); }
    });
  });

  // send 204 status
  res.status(204);
  res.end();
});

/** *******************/
// Unsupported HTTP Verbs
/** *******************/

// /api/courses/:courseId/reviews
// PUT 403 - Cannot edit a collection of reviews.
router.put('/courses/:courseId/reviews', function (req, res, next) {
  res.status(403).json({message: 'Cannot edit a collection of reviews.'});
});

// DELETE 403 - Cannot delete a collection of reviews.
router.delete('/courses/:courseId/reviews', function (req, res, next) {
  res.status(403).json({message: 'Cannot delete a collection of reviews.'});
});

// /api/courses/:courseId/reviews/:id
// GET 403 - Cannot get a single review. Use the '/api/courses/:id' route instead to get the reviews for a specific course.
router.get('/courses/:courseId/reviews/:id', function (req, res, next) {
  res.status(403).json({message: 'Cannot get a single review. Use the "/api/courses/:id" route instead to get the reviews for a specific course.'});
});

// POST 405 - Use the '/api/courses/:courseId/reviews' route to create a review.
// Also include an Allow header with the value DELETE
router.post('/courses/:courseId/reviews/:id', function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'DELETE');
  res.status(405).json({message: 'Use the "/api/courses/:courseId/reviews" route to create a review.'});
});

// PUT 403 - Cannot edit a review.
router.put('/courses/:courseId/reviews/:id', function (req, res, next) {
  res.status(403).json({message: 'Cannot edit a review.'});
});

module.exports = router;
