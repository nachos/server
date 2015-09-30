'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var controller = require('./controller');

var router = express.Router();

router
  .get('/signin', passport.authenticate('google', {
    callbackURL: '/auth/google/signin/callback',
    session: false
  }))
  .get('/signin/callback', passport.authenticate('google', {
    callbackURL: '/auth/google/signin/callback',
    session: false
  }), controller.signin)

  .get('/connect', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated(), passport.authenticate('google', {callbackURL: '/auth/google/connect/callback'}))
  .get('/connect/callback', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated(), controller.connect)

  .post('/disconnect', auth.isAuthenticated(), controller.disconnect);

module.exports = router;