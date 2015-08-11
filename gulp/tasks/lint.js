'use strict';

var runSequence = require('run-sequence');

module.exports = function (gulp) {
  gulp.task('lint', ['lint:server', 'lint:test', 'lint:gulp']);

  gulp.task('lint:server', function (cb) {
    runSequence(
      'jshint:server',
      'jscs:server',
      cb
    );
  });

  gulp.task('lint:test', function (cb) {
    runSequence(
      'jshint:test',
      'jscs:test',
      cb
    );
  });

  gulp.task('lint:gulp', function (cb) {
    runSequence(
      'jshint:gulp',
      'jscs:gulp',
      cb
    );
  });
};
