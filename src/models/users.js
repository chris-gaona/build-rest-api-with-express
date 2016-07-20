'use strict';

var mongoose = require('mongoose');
var Validator = require('validator');
var bcrypt = require('bcrypt');
var saltRounds = 10;

// User
// _id (ObjectId, auto-generated)
// fullName (String)
// emailAddress (String)
// hashedPassword (String)

var UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required']
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

UserSchema.methods.setPassword = function (password) {
  // Update the User model to store the user's password as a hashed value.
  var salt = bcrypt.genSaltSync(saltRounds);
  this.hashedPassword = bcrypt.hashSync(password, salt);
};

UserSchema.path('emailAddress').validate(function (v) {
  return Validator.isEmail(v);
}, 'Please provide a valid email address.');

UserSchema.path('emailAddress').validate(function (value, done) {
  this.model('User').count({ emailAddress: value }, function (err, count) {
    if (err) {
      return done(err);
    }
    // If `count` is greater than zero, "invalidate"
    done(!count);
  });
}, 'The email address you provided is already in use.');

var User = mongoose.model('User', UserSchema);

module.exports = User;
