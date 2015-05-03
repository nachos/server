'use strict';

var passport = require('passport');
var User = require('../../api/user/user.model');
var auth = require('../auth.service');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');

exports.signin = function (req, res, next) {
  passport.authenticate('facebook', { callbackURL: '/auth/facebook/signin/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/login');
    }

    User.findOne({ 'providers.facebook.id': info.id }, function (err, user) {
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
  passport.authenticate('facebook', { callbackURL: '/auth/facebook/signup/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/signup');
    }

    User.findOne({ 'providers.facebook.id': info.id }, function (err, user) {
      if (err) {
        // TODO: what?
        return next(err);
      }

      if (!user) {
        var facebookToken = jwt.sign({ id: info.id, link: info.link }, config.secrets.session, { expiresInMinutes: 300 });

        var userInfo = {
          name: {
            first: info.first_name,
            last: info.last_name
          },
          email: info.email,
          gender: info.gender
        };

        var formattedUserData = new Buffer(JSON.stringify({
          provider: 'facebook',
          token: facebookToken,
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

  passport.authenticate('facebook', { callbackURL: '/auth/facebook/connect/callback' }, function (err, user, info) {
    if (err || !info) {
      // TODO: what?
      return res.redirect('/');
    }

    User.findOne({ 'providers.facebook.id': info.id }, function (err, user) {
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
        User.update({_id: req.user._id}, { 'providers.facebook': { id: info.id, link: info.link }}, { multi: false }, function (err) {
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
  User.update({_id: req.user._id}, { $unset: {'providers.facebook': true}}, { multi: false }, function (err) {
    if (err) {
      // TODO: what?
      return next(err);
    }

    return res.status(204).end();
  });
};