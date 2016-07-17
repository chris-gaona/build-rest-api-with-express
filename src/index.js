'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var jsonParser = require('body-parser').json;

var app = express();

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

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
