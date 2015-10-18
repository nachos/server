'use strict';

var Q = require('q');
var streamToJson = require('stream-to-json');
var path = require('path');
var fs = require('fs');
var tar = require('tar-stream');
var zlib = require('zlib');
var mkdirp = require('mkdirp');

var getPkgTgz = function (pkgName, os, arch) {
  return path.join('tarballs', [pkgName, os, arch].join('-') + '.tgz');
};

var findJson = function (file, callback) {
  var extract = tar.extract();

  var fileStream;

  extract.on('entry', function (header, stream, cb) {
    if (header.name === file) {
      fileStream = stream;
      cb();
    }
    else {
      stream.on('end', cb);
      stream.resume();
    }
  });

  extract.on('finish', function () {
    if (!fileStream) {
      return callback('can\'t find json file');
    }

    streamToJson(fileStream, function (err, json) {
      if (err) {
        return callback(err);
      }

      callback(null, json);
    });

    fileStream.resume();
  });

  return extract;
};

exports.upload = function (file, pkgName, os, arch) {
  var deferred = Q.defer();
  var fileName = getPkgTgz(pkgName, os, arch);

  fs.createReadStream(file)
    .pipe(zlib.Unzip())
    .on('error', function () {
      fs.unlink(file, function (err) {
        return deferred.reject(err);
      });
    })
    .pipe(findJson('nachos.json', function (err, nachosJson) {
      if (err) {
        return deferred.reject(err);
      }

      if (nachosJson.name !== pkgName) {
        return deferred.reject('conflict in package name');
      }

      return Q.nfcall(mkdirp, path.dirname(fileName))
        .then(function () {
          return Q.nfcall(fs.rename, file, fileName);
        })
        .then(function () {
          return deferred.resolve(nachosJson);
        })
        .catch(function () {
          return fs.unlink(file, function () {
            return deferred.reject(err);
          });
        });
    }));

  return deferred.promise;
};

exports.download = function (pkgName, os, arch) {
  var fileName = getPkgTgz(pkgName, os, arch);

  return fs.createReadStream(fileName);
};
