'use strict';

var config = require('../config');
var nodemon = require('nodemon');

module.exports = function (gulp) {
  gulp.task('nodemon', function (cb) {
    nodemon({
      script: 'server/app.js',

      options: {
        nodeArgs: ['--debug']
      },

      // Watch core server file(s) that require server restart on change
      watch: [config.paths.server]
    })
      .once('start', cb);
  });
};