'use strict';

var passport = require('passport');
var User = require('../../api/user/user.model');
var auth = require('../auth.service');

exports.signin = function (req, res) {
  auth.setTokenCookie(req, res);
};

exports.connect = function (req, res, next) {
  // TODO: already connected ?

  passport.authenticate('google', {callbackURL: '/auth/google/connect/callback'}, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/');
    }

    User.findOne({'providers.google.id': info.id}, function (err, user) {
      if (err) {
        // TODO: what?
        return next(err);
      }

      if (user) {
        // TODO: what?!
        return res.redirect('/');
      }
      else {
        // TODO: req user undefined?
        User.update({_id: req.user._id}, {
          'providers.google': {
            id: info.id,
            link: info.link
          }
        }, {multi: false}, function (err) {
          if (err) {
            // TODO: what?
            return next(err);
          }

          return res.redirect('/');
        });
      }
    });
  })(req, res, next);
};

exports.disconnect = function (req, res, next) {
  User.update({_id: req.user._id}, {$unset: {'providers.google': true}}, {multi: false}, function (err) {
    if (err) {
      // TODO: what?
      return next(err);
    }

    return res.status(204).end();
  });
};