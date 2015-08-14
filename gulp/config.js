'use strict';

module.exports = {
  paths: {
    server: ['server/**/*.js', '!server/**/*.spec.js'],
    test: './server/**/*.spec.js',
    gulp: ['./gulpfile.js', './gulp/**/*.js'],
    coverage: 'coverage/**/lcov.info',
    certs: './server/config/certs',
    environment: './server/config/environment',
    env: {
      local: './server/config/local.env',
      test: 'test',
      prod: 'production'
    }
  },
  manifests: ['./package.json']
};