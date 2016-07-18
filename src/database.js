'use strict';

// Set up a database connection.
// Use npm to install Mongoose.
// Using Mongoose, create a connection to your MongoDB database.
// Write a message to the console if there's an error connecting to the database.
// Write a message to the console once the connection has been successfully opened.

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/treehouse_courses');

var db = mongoose.connection;

db.on('error', function (err) {
  console.error('Connection error:', err);
});

db.once('open', function () {
  // // seed database
  // require('./seed');

  console.log('db connection successful');
});
