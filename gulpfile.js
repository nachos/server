/** Regular npm dependendencies */
var gulp = require('gulp');
var _ = require('lodash');
var pem = require('pem');
var fs = require('fs');
var es = require('event-stream');
var stylish = require('jshint-stylish');
var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');
var open = require('open');

/** Gulp dependencies */
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var file = require('gulp-file');
var env = require('gulp-env');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

/** Grab-bag of build configuration. */
var config = {};

/** Reusable functions */

function jshintPipe(jshintrc) {
  return lazypipe()
    .pipe(jshint, jshintrc)
    .pipe(jshint.reporter, stylish)
    .pipe(jshint.reporter, 'fail')();
}

function getServerConfig() {
  return require('./server/config/environment');
}

/** Gulp tasks */

gulp.task('default', ['test']);

gulp.task('generate-certs', function (cb) {
  pem.createCertificate({days: 3650, selfSigned: true}, function (err, keys) {
    if (err) {
      return cb(err);
    }

    var certs = [{
      name: 'server.key',
      data: keys.serviceKey
    }, {
      name: 'server.crt',
      data: keys.certificate
    }, {
      name: 'server.csr',
      data: keys.csr
    }];

    var streams = _.map(certs, function (cert) {
      return file(cert.name, cert.data, {src: true});
    });

    es.merge.apply(this, streams)
      .pipe(gulp.dest('server/config/certs'))
      .on('end', cb);
  });
});

gulp.task('bump', function () {
  gulp.src(['./package.json'])
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function () {
  gulp.src(['./package.json'])
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function () {
  gulp.src(['./package.json'])
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('env:local', function () {
  env({file: 'server/config/local.env'});
});

gulp.task('env:test', function () {
  env({vars: {NODE_ENV: 'test'}});
});

gulp.task('env:prod', function () {
  env({vars: {NODE_ENV: 'production'}});
});

gulp.task('mocha', ['env:test', 'env:local'], function (cb) {
  gulp.src('server/**/*.spec.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      gutil.log(err.toString());
    })
    .once('end', function () {
      cb();
    });
});

gulp.task('test', ['jshint:all'], function () {
  runSequence(
    'jshint:all',
    'mocha',
    function () {
      process.exit(0);
    });
});

gulp.task('jshint:all', ['jshint', 'jshint:test', 'jshint:gulpfile']);

gulp.task('jshint', function () {
  return gulp.src(['server/**/*.js', '!server/**/*.spec.js'])
    .pipe(jshintPipe('server/.jshintrc'));
});

gulp.task('jshint:test', function () {
  return gulp.src('server/**/*.spec.js')
    .pipe(jshintPipe('server/.spec.jshintrc'));
});

gulp.task('jshint:gulpfile', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshintPipe('server/.jshintrc'));
});

gulp.task('nodemon', function (cb) {
  nodemon({
    script: 'server/app.js',

    // watch core server file(s) that require server restart on change
    watch: ['server/**/*.{js,json}']
  })
    .once('start', cb);
});

gulp.task('open', function () {
  var serverConfig = getServerConfig();
  var protocol = serverConfig.requireSSL ? 'https' : 'http';
  open(protocol + "://localhost:" + serverConfig.port);
});

gulp.task('serve', function (cb) {
  runSequence(
    'jshint',
    'env:local',
    'nodemon',
    'open',
    cb);
});
