'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../api/user/user.model');
var logger = require('../../components/logger');

exports.setup = function (config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      scope: [
        'https://www.googleapis.com/auth/profile',
        'https://www.googleapis.com/auth/email',
        'https://www.googleapis.com/auth/calendar'
      ]
    },
    function (accessToken, refreshToken, profile, done) {
      var info = profile._json;

      User.findOneQ({ 'providers.google.id': profile.id})
        .then(function (user) {
          if (user) {
            return done(null, user);
          }

          return User.findOneQ({email: info.email})
            .then(function (user) {
              if (user) {
                // TODO: maybe ask to connect to user
                return done(null, false, { message: 'email already in use'});
              }

              var newUser = new User({
                name: {
                  first: info.name.givenName,
                  last: info.name.familyName
                },
                email: info.emails[0].value,
                gender: info.gender,
                providers: {
                  google: {
                    id: profile.id,
                    token: accessToken
                  }
                }
              });

              return newUser.saveQ()
                .then(function (user) {
                  done(null, user);
                })
                .catch(function (err) {
                  done(err);
                });
            });
        })
        .catch(function (err) {
          logger.error({err: err});
          done(err);
        });
    }

  ));
};
