'use strict';

var config = require('../config');
var env = require('gulp-env');

module.exports = function (gulp) {
  gulp.task('env:local', function () {
    env({file: config.paths.env.local});
  });

  gulp.task('env:test', function () {
    env({vars: {NODE_ENV: config.paths.env.test}});
  });

  gulp.task('env:prod', function () {
    env({vars: {NODE_ENV: config.paths.env.prod}});
  });
};