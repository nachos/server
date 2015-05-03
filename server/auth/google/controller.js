'use strict';

var passport = require('passport');
var User = require('../../api/user/user.model');
var auth = require('../auth.service');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');

exports.signin = function (req, res, next) {
  passport.authenticate('google', { callbackURL: '/auth/google/signin/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/login');
    }

    User.findOne({ 'providers.google.id': info.id }, function (err, user) {
      if (err) {
        // TODO: what?
        return next(err);
      }

      if (!user) {
        return res.redirect('/login');
      }
      else {
        // login

        req.user = user;
        auth.setTokenCookie(req, res);
      }
    });
  })(req, res, next);
};

exports.signup = function (req, res, next) {
  passport.authenticate('google', { callbackURL: '/auth/google/signup/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/signup');
    }

    User.findOne({ 'providers.google.id': info.id }, function (err, user) {
      if (err) {
        // TODO: what?
        return next(err);
      }

      if (!user) {
        var googleToken = jwt.sign({ id: info.id, link: info.link }, config.secrets.session, { expiresInMinutes: 300 });

        var userInfo = {
          name: {
            first: info.given_name,
            last: info.family_name
          },
          email: info.email,
          gender: info.gender
        };

        var formattedUserData = new Buffer(JSON.stringify({
          provider: 'google',
          token: googleToken,
          info: userInfo
        })).toString("base64");

        return res.redirect('/signup/' + formattedUserData);
      }
      else {
        req.user = user;
        auth.setTokenCookie(req, res);
      }
    });
  })(req, res, next);
};

exports.connect = function (req, res, next) {
  // TODO: already connected ?

  passport.authenticate('google', { callbackURL: '/auth/google/connect/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/');
    }

    User.findOne({ 'providers.google.id': info.id }, function (err, user) {
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
        User.update({_id: req.user._id}, { 'providers.google': { id: info.id, link: info.link }}, { multi: false }, function (err) {
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
  User.update({_id: req.user._id}, { $unset: {'providers.google': true}}, { multi: false }, function (err) {
    if (err) {
      // TODO: what?
      return next(err);
    }

    return res.status(204).end();
  });
};