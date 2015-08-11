'use strict';

var Q = require('q');
var _ = require('lodash');
var Package = require('../../api/package/package.model');

module.exports = function (users) {
  var deferred = Q.defer();

  Package.find({})
    .remove(function () {
      Package.create(
        {
          name: 'movie-list',
          version: '0.1.0',
          time: {
            created: new Date(),
            modified: new Date()
          },
          description: 'movie list dip',
          keywords: ['movie', 'list'],
          owners: users,
          repository: 'http://github.com/nachos/movie-list-dip',
          dist: {
            tarball: 'http://nach.os/lol.tgz',
            shasum: '8416d24b5bbfa4963b075de867b049a284f34888'
          },
          type: 'dip'
        },
        {
          name: 'translation',
          version: '0.1.0',
          time: {
            created: new Date(),
            modified: new Date()
          },
          description: 'translation dip',
          keywords: ['translation'],
          owners: users,
          repository: 'http://github.com/nachos/translation-dip',
          dist: {
            tarball: 'http://nach.os/lol.tgz',
            shasum: '8416d24b5bbfa4963b075de867b049a284f34888'
          },
          type: 'dip'
        },
        function (err) {
          if (err) {
            deferred.reject(err);
          }
          else {
            deferred.resolve(_.toArray(arguments).slice(1));
          }
        });
    }, function (err) {
      if (err) {
        deferred.reject(err);
      }
    });

  return deferred.promise;
};