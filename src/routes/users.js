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
* Requires the User Mongoose model
* @requires User Mongoose model
*/
var User = require('../models/users');
/**
* Requires the auth module
* @requires auth module
*/
var auth = require('../auth.js');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', auth, function (req, res, next) {
  // doesn't allow anything other than the current user's information to be returned from the GET /api/users route.

  // fixes up data to be used by Angular client side
  var authUser = {};
  authUser.data = [];
  authUser.data.push(req.user);
  // send json response
  res.json(authUser);
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// "message": "Validation Failed", "errors": { "property": [ { "code": "", "message": "" }, ... ] } }
router.post('/users', function (req, res, next) {
  // if password or confirmPassword don't exist
  if (!req.body.password || !req.body.confirmPassword) {
    // return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Please fill out all fields' } ] }
    });
  // if password does not pass the regex
  } else if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(req.body.password) === false) {
    // return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Your password should contain at least one digit, at least one lowercase, at least one uppercase, & at least 8 digits' } ] }
    });
  // if password does not match confirmPassword
  } else if (req.body.password !== req.body.confirmPassword) {
    // return validation error
    return res.status(400).json({
      message: 'Validation Failed', errors: { property: [ { code: 400, message: 'Password & confirm password do not match' } ] }
    });
  }

  // create new User
  var user = new User();
  // set fullName
  user.fullName = req.body.fullName;
  // set emailAddress
  user.emailAddress = req.body.emailAddress;
  // set password by calling mongoose instance method
  user.setPassword(req.body.password);

  // save the user
  user.save(function (err) {
    // if errors
    if (err) {
      // check for validation errors
      if (err.name === 'ValidationError') {
        if (err.errors.fullName) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.fullName.message } ] }
          });
        } else if (err.errors.emailAddress) {
          return res.status(400).json({
            message: 'Validation Failed', errors: { property: [ { code: 400, message: err.errors.emailAddress.message } ] }
          });
        }
      } else {
        // else send error to error handler
        return next(err);
      }
    }
    // send 201 status
    res.status(201);
    res.end();
  });
});

/** *******************/
// Unsupported HTTP Verbs
/** *******************/

// /api/users
// PUT 403 - Cannot edit a collection of users.
router.put('/users', function (req, res, next) {
  res.status(403).json({message: 'Cannot edit a collection of users.'});
});

// DELETE 403 - Cannot delete a collection of users.
router.delete('/users', function (req, res, next) {
  res.status(403).json({message: 'Cannot delete a collection of users.'});
});

module.exports = router;
