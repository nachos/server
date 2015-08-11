'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../api/user/user.model');
var logger = require('../../components/logger');

exports.setup = function (config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      profileFields: [
        'id',
        'link',
        'picture.type(large)',
        'email',
        'first_name',
        'last_name',
        'gender'
      ],
      scope: [
        'user_friends'
      ]
    },
    function (accessToken, refreshToken, profile, done) {
      var info = profile._json;

      User.findOneQ({ 'providers.facebook.id': profile.id})
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

              // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

              var newUser = new User({
                name: {
                  first: info.first_name,
                  last: info.last_name
                },
                email: info.email,
                gender: info.gender,
                providers: {
                  facebook: {
                    id: profile.id
                  }
                }
              });

              // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

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