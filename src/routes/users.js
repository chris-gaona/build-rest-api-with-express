'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');
var User = require('../models/users');

var courses = require('../data/data.json');

var auth = require('../auth.js');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', auth, function (req, res, next) {
  var authUser = {};
  authUser.data = [];
  authUser.data.push(req.user);
  res.json(authUser);
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
// "message": "Validation Failed", "errors": { "property": [ { "code": "", "message": "" }, ... ] } }
router.post('/users', auth, function (req, res, next) {
  if (!req.body.password || !req.body.confirmPassword){
    return res.status(400).json({
      message: "Validation Failed", errors: { property: [ { code: 400, message: "Please fill out all fields" } ] }
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      message: "Validation Failed", errors: { property: [ { code: 400, message: "Password & confirm password do not match" } ] }
    });
  }
  var user = new User();

  user.fullName = req.body.fullName;
  user.emailAddress = req.body.emailAddress;
  user.setPassword(req.body.password);

  user.save(function (err) {
    console.log(err);
    if (err) {
      if (err.name === 'ValidationError') {
        if (err.errors.fullName) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.fullName.message } ] }
          });
        } else if (err.errors.emailAddress) {
          return res.status(400).json({
            message: "Validation Failed", errors: { property: [ { code: 400, message: err.errors.emailAddress.message } ] }
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

module.exports = router;
