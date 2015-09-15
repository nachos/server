'use strict';

var _ = require('lodash');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    .use(function (req, res, next) {
      // Allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        req.headers.authorization = 'Bearer ' + req.query.access_token;

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
      }

      validateJwt(req, res, next);
    })

    // Attach user to request
    .use(function (req, res, next) {
      User.findById(req.user._id)
        .populate('roles')
        .exec(function (err, user) {
          if (err) {
            return next(err);
          }

          if (!user) {
            return res.status(401).end();
          }

          req.user = user;
          next();
        });
    });
}

function fillAuthorizationHeaderFromCookie() {
  return function (req, res, next) {
    if (req.cookies && req.cookies.token) {
      // Allow access_token to be passed through the token cookie as well
      var accessToken = req.cookies.token;

      accessToken = accessToken.substring(1, accessToken.length - 1);

      req.headers.authorization = 'Bearer ' + accessToken;
    }

    next();
  };
}

/**
 * Checks if the user permission meets the minimum requirements of the route
 */
function hasPermissions() {
  if (!arguments) {
    throw new Error('Required permission needs to be set');
  }

  var wantedPermissions = arguments;

  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      var permissions = _.flatten(_.pluck(req.user.roles, 'permissions'));

      if (!_.isEmpty(_.difference(wantedPermissions, permissions))) {
        return res.status(403).end();
      }

      next();
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 300});
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).json({message: 'something went wrong, try again'});
  }

  var token = signToken(req.user._id.toString());

  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.fillAuthorizationHeaderFromCookie = fillAuthorizationHeaderFromCookie;
exports.hasPermissions = hasPermissions;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;