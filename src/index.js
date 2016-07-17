'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var jsonParser = require('body-parser').json;

var app = express();

require('./database');

var routes = require('./routes.js');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
// used to parse json
app.use(jsonParser());

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));
app.use('/api', routes);

// Set up error handlers.
// Add a global error handler middleware function that writes error information to the response in the JSON format.
// Add a middleware function to catch 404 errors and forward an error to the global error handler.
// catch 404 & forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
