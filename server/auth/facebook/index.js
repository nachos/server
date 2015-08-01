'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var controller = require('./controller');

var router = express.Router();

router
  .get('/signin', passport.authenticate('facebook', { callbackURL: '/auth/facebook/signin/callback', session: false }))
  .get('/signin/callback', passport.authenticate('facebook', { successURL: '/', callbackURL: '/auth/facebook/signin/callback', session: false }), controller.signin)

  .get('/connect', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated() ,passport.authenticate('facebook', { callbackURL: '/auth/facebook/connect/callback' }))
  .get('/connect/callback', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated(), controller.connect)

  .post('/disconnect', auth.isAuthenticated(), controller.disconnect);

module.exports = router;