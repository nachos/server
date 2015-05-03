/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var httpAuth = require('http-auth');
var _ = require('lodash');
var ejs = require('ejs');


module.exports = function(app) {
  var env = app.get('env');

  app.set('views', path.join(config.root, 'server', 'views'));
  app.set('view engine', 'html');
  app.engine('html', ejs.renderFile);
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  if(config.basicAuth && config.basicAuth.enabled) {
    app.use(httpAuth.connect(httpAuth.basic({
      realm: config.basicAuth.realm,
      skipUser: true
    }, function (username, password, callback) {
      callback(config.basicAuth.users[username] === password);
    })));
  }

  if ('test' !== env) {
      app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(errorHandler()); // Error handler - has to be last
  }
};
