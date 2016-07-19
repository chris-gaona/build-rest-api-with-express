'use strict';

var User = require('./models/users');
var basicAuth = require('basic-auth');
var bcrypt = require('bcrypt');
var saltRounds = 10;

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }

  var user = basicAuth(req);

  if (!user || !user.emailAddress || !user.password) {
    return unauthorized(res);
  }

  User.findOne({'emailAddress': user.emailAddress}, function (err, user) {
    if(err) return next(err);

    if (user) {
      if (bcrypt.compareSync(user.password, user.hashedPassword)) {
        return next();
      } else {
        return unauthorized(res);
      }
    } else {
      return unauthorized(res);
    }
  });
};

module.exports = auth;
