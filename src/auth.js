/**
* @module User Authorization
*/

'use strict';

/**
* Requires the User Mongoose model
* @requires User Mongoose model
*/
var User = require('./models/users');
/**
* Requires the basic-auth module
* @requires basic-auth
*/
var basicAuth = require('basic-auth');
/**
* Requires the bcrypt module
* @requires bcrypt
*/
var bcrypt = require('bcrypt');

/**
* @function auth
* @description The auth function checks whether there is a Authorization header on the request
* @param req - the request from the client
* @param res - the response to the client
* @param next - next passes on the request to the next handler
* @returns Either next() to pass the request to the next middleware OR the unauthorized function to send a 401 unauthorized status as a response
*/
var auth = function (req, res, next) {
  /**
  * @function unauthorized
  * @description The unauthorized function returns a 401 unauthorized status as the response
  * @param res - response to the client
  * @returns The response status code 401 - unauthorized
  */
  function unauthorized (res) {
    // res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }

  // uses basic-auth to parse the Authorization header credentials
  var user = basicAuth(req);

  // if the user exists or user.name or user.pass
  if (!user || !user.name || !user.pass) {
    // return unauthorized function
    return unauthorized(res);
  } else {
    // else find the user in the db by their email address
    User.findOne({emailAddress: user.name}, function (err, email) {
      // if there is an error pass it along to the error handler
      if (err) return next(err);

      // if email response form db exists
      if (email) {
        // use bcrypt to compare the user password with the hashed password stored in the database
        // returns true or false
        if (bcrypt.compareSync(user.pass, email.hashedPassword)) {
          // if true store the email in req.user & pass it to the next handler
          req.user = email;
          return next();
        } else {
          // else return unauthorized 401
          return unauthorized(res);
        }
      } else {
        // if email doesn't even exists return unauthorized 401
        return unauthorized(res);
      }
    });
  }
};

module.exports = auth;
