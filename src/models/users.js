/**
* @module Users Model
*/

'use strict';

/**
* Requires the mongoose model
* @requires mongoose
*/
var mongoose = require('mongoose');
/**
* Requires the validator model
* @requires validator
*/
var Validator = require('validator');
/**
* Requires the bcrypt model
* @requires bcrypt
*/
var bcrypt = require('bcrypt');
// creates salt rounds
var saltRounds = 10;

// User
// _id (ObjectId, auto-generated)
// fullName (String)
// emailAddress (String)
// hashedPassword (String)

// create User mongoose schema
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

// creates instance method to hash password for storage in database
/**
* @function setPassword
* @description The setPassword function creates the hash based on the password
* @param {string} password - the password to hash
*/
UserSchema.methods.setPassword = function (password) {
  // Update the User model to store the user's password as a hashed value.
  var salt = bcrypt.genSaltSync(saltRounds);
  this.hashedPassword = bcrypt.hashSync(password, salt);
};

// ADDED NEW FROM WATCHING TREEHOUSE AUTHENTICATION VIDEO...WANT TO KEEP IT HERE FOR REFERENCE
// UserSchema.static.authenticate = function (email, password, callback) {
//   User.findOne({ emailAddress: email })
//   .exec(function (err, user) {
//     if (err) {
//       return callback(err);
//     } else if (!user) {
//       var error = new Error('User not found.');
//       error.status = 401;
//       return callback(error);
//     }
//     bcrypt.compare(password, user.hashedPassword, function (err, result) {
//       if (result === true) {
//         return callback(null, user);
//       } else {
//         return callback();
//       }
//     });
//   });
// };
//
// UserSchema.pre('save', function (next) {
//   var user = this;
//   bcrypt.hash(user.password, 10, function (err, hash) {
//     if (err) return next(err);
//
//     user.hashedPassword = hash;
//     next();
//   });
// });
// END

// adds custom validation to emailAddress to make sure it's a valid email address
UserSchema.path('emailAddress').validate(function (v) {
  return Validator.isEmail(v);
}, 'Please provide a valid email address.');

// add custom validation to emailAddress to make sure the email is not already taken
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
