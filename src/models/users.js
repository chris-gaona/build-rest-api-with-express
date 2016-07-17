'use strict';

var mongoose = require('mongoose');

// User
// _id (ObjectId, auto-generated)
// fullName (String)
// emailAddress (String)
// hashedPassword (String)

var UserSchema = new mongoose.Schema({
  fullName: String,
  emailAddress: {
    type: String,
    unique: true
  },
  hashedPassword: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
