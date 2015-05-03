'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var controller = require('./controller');

var router = express.Router();

router
  .get('/signin', passport.authenticate('facebook', { callbackURL: '/auth/facebook/signin/callback' }))
  .get('/signin/callback', controller.signin)

  .get('/signup', passport.authenticate('facebook', { callbackURL: '/auth/facebook/signup/callback' }))
  .get('/signup/callback', controller.signup)

  .get('/connect', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated() ,passport.authenticate('facebook', { callbackURL: '/auth/facebook/connect/callback' }))
  .get('/connect/callback', auth.fillAuthorizationHeaderFromCookie(), auth.isAuthenticated(), controller.connect)

  .post('/disconnect', auth.isAuthenticated(), controller.disconnect);

module.exports = router;