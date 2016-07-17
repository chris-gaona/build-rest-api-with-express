'use strict';

var mongoose = require('mongoose');

// User
// _id (ObjectId, auto-generated)
// fullName (String)
// emailAddress (String)
// hashedPassword (String)

var UserSchema = new mongoose.Schema({
  fullName: String,
  emailAddress: String,
  hashedPassword: String
});

var User = mongoose.model('UserSchema', UserSchema);

module.exports.User = User;
