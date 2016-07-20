'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');

var auth = require('../auth.js');

// POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/:courseId/reviews', auth, function (req, res, next) {
  var review = new Review(req.body);
  review.user = req.user;

  Course.findOne({_id: req.params.courseId}, 'reviews usersWhoReviewed', function (err, course) {
    if (err) { return next(err); }

    if (course.usersWhoReviewed.indexOf(review.user._id) !== -1) {
      console.log(true);
      return res.status(400).json({
        message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Sorry, you have already posted a review for this course' } ] }
      });
    } else {
      course.reviews.push(review);
      course.usersWhoReviewed.push(review.user);

      course.save(function (err) {
        if (err) { return next(err); }
      });

      review.save(function (err) {
        console.log(err);
        if (err) {
          if (err.name === 'ValidationError') {
            return res.status(400).json({
              message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.rating.message } ] }
            });
          } else {
            return next(err);
          }
        }
        res.status(201);
        res.end();
      });
    }
  });
});

// DELETE /api/courses/:courseId/reviews/:id 204 - Deletes the specified review and returns no content
router.delete('/courses/:courseId/reviews/:id', auth, function (req, res, next) {
  Review.remove({_id: req.params.id}, function (err) {
    if (err) { return next(err); }
  });

  Course.findOne({_id: req.params.courseId}, 'reviews usersWhoReviewed', function (err, course) {
    if (err) { return next(err); }

    // splice out the deleted post from userPosts array
    course.reviews.splice(course.reviews.indexOf(req.params.id), 1);
    course.usersWhoReviewed.splice(course.usersWhoReviewed.indexOf(req.user), 1);

    course.save(function (err) {
      if (err) { return next(err); }
    });
  });

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
