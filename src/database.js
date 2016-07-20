/**
* @module Database Connection
*/

'use strict';

/**
* Requires the mongoose module
* @requires mongoose
*/
var mongoose = require('mongoose');

// sets up a database connection
mongoose.connect('mongodb://localhost/treehouse_courses');

// store mongoose connection to db in db variable
var db = mongoose.connection;

// writes a message to the console if there's an error connecting to the database
db.on('error', function (err) {
  console.error('Connection error:', err);
});

// writes a message to the console once the connection has been successfully opened
db.once('open', function () {
  // // seed database
  // require('./seed');

  console.log('db connection successful');
});
