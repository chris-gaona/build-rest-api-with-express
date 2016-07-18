'use strict';

var mongoose = require('mongoose');
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
    required: true
  },
  emailAddress: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  // Update the User model to store the user's password as a hashed value.
  bcrypt.hash(user.hashedPassword, saltRounds, function(err, hash) {
    if(err) return next(err);
    // Store hash in your password DB.
    user.hashedPassword = hash;
    next();
  });
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
