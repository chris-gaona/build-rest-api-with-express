'use strict';

var User = require('./models/users');
var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');
var saltRounds = 10;

var auth = function (req, res, next) {
  function unauthorized(res) {
    // res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  } else {
    User.findOne({emailAddress: user.name}, function (err, email) {
      console.log(err);
      if(err) return next(err);

      if (email) {
        if (bcrypt.compareSync(user.pass, email.hashedPassword)) {
          req.user = email;
          return next();
        } else {
          return unauthorized(res);
        }
      } else {
        console.log('nope')
        return unauthorized(res);
      }
    });
  }
};

module.exports = auth;
