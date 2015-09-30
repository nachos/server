'use strict';

var jscs = require('gulp-jscs');
var config = require('../config');

module.exports = function (gulp) {
  gulp.task('jscs', ['jscs:server', 'jscs:test', 'jscs:gulp']);

  gulp.task('jscs:server', function () {
    return gulp.src(config.paths.server)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });

  gulp.task('jscs:test', function () {
    return gulp.src(config.paths.test)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });

  gulp.task('jscs:gulp', function () {
    return gulp.src(config.paths.gulp)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });
};
