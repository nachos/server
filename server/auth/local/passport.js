'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../api/user/user.model');
var logger = require('../../components/logger');

exports.setup = function () {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // This is the virtual field on the model
    },
    function (email, password, done) {
      User.findOneQ({email: email.toLowerCase()}, 'salt hashedPassword')
        .then(function (user) {
          if (!user || !user.authenticate(password)) {
            return done(null, false, {message: 'Invalid email or password'});
          }

          return done(null, user);
        })
        .catch(function (err) {
          logger.error({err: err});
          done(err);
        });
    }

  ));
};