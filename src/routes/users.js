'use strict';

var express = require('express');
var router = express.Router();

var Course = require('../models/courses');
var Review = require('../models/reviews');
var User = require('../models/users');

var courses = require('../data/data.json');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function (req, res, next) {
  res.json('You sent a GET request to find the current user');
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function (req, res, next) {
  if(!req.body.password || !req.body.confirmPassword){
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  } else if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      message: 'Password & confirm password do not match'
    });
  }
  var user = new User();

  user.fullName = req.body.fullName;
  user.emailAddress = req.body.emailAddress;
  user.setPassword(req.body.password);

  user.save(function (err) {
    console.log(err);
    if(err) {
      res.status(400);
      res.json(err.errors);
      return;
    }
    res.status(201);
    res.json({message: 'success'});
  });
});

module.exports = router;
