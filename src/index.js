/**
* @module Main Index.js
*/

'use strict';

// load modules
/**
* Requires the express module
* @requires express
*/
var express = require('express');
/**
* Requires the morgan module
* @requires morgan
*/
var morgan = require('morgan');


var session = require('express-session');
/**
* Requires the jsonParser module
* @requires jsonParser
*/
var jsonParser = require('body-parser').json;

/**
* Requires the courses model
* @requires courses model
*/
require('./models/courses');
/**
* Requires the reviews model
* @requires reviews model
*/
require('./models/reviews');
/**
* Requires the users model
* @requires users model
*/
require('./models/users');
// MONGOOSE / MONGO Database
require('./database');

// sets up initial express app
var app = express();

// use session for tracking session
app.use(session({
  secret: 'course',
  resave: true,
  saveUninitialized: false
}));

// ROUTES
var routes = require('./routes');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
// used to parse json
app.use(jsonParser());

// sets up our static route to serve files from the "public" folder
app.use('/', express.static('public'));
app.use('/api', routes.course);
app.use('/api', routes.review);
app.use('/api', routes.user);

// Sets up error handlers.
// Add a middleware function to catch 404 errors and forward an error to the global error handler.
// catch 404 & forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Adds a global error handler middleware function that writes error information to the response in the JSON format.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + server.address().port);
});
