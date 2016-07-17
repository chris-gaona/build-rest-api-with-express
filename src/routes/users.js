'use strict';

var express = require('express');
var router = express.Router();

var courses = require('../data/data.json');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', function (req, res, next) {
  res.json('You sent a GET request to find the current user');
});

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', function (req, res, next) {
  res.status(201).json('You sent a POST request to create a new user');
});

module.exports = router;
