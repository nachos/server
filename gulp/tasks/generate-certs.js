'use strict';

var config = require('../config');
var pem = require('pem');
var file = require('gulp-file');
var es = require('event-stream');
var _ = require('lodash');

module.exports = function (gulp) {
  gulp.task('generate-certs', function (cb) {
    pem.createCertificate({
      days: 3650,
      selfSigned: true
    }, function (err, keys) {
      if (err) {
        return cb(err);
      }

      var certs = [
        {
          name: 'server.key',
          data: keys.serviceKey
        }, {
          name: 'server.crt',
          data: keys.certificate
        }, {
          name: 'server.csr',
          data: keys.csr
        }
      ];

      var streams = _.map(certs, function (cert) {
        return file(cert.name, cert.data, {src: true});
      });

      es.merge.apply(this, streams)
        .pipe(gulp.dest(config.certs))
        .on('end', cb);
    });
  });
};