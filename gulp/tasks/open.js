'use strict';

var config = require('../config');
var open = require('open');

module.exports = function (gulp) {
  function getServerConfig() {
    return require('../../' + config.paths.environment);
  }

  gulp.task('open', function () {
    var serverConfig = getServerConfig();
    var protocol = serverConfig.requireSSL ? 'https' : 'http';

    open(protocol + '://localhost:' + serverConfig.port);
  });
};