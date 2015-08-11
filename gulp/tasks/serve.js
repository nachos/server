'use strict';

var runSequence = require('run-sequence');

module.exports = function (gulp) {
  gulp.task('serve', function (cb) {
    runSequence(
      'lint',
      'env:local',
      'nodemon',
      'open',
      cb);
  });
};