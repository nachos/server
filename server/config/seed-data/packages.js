var Q = require('q');
var _ = require('lodash');
var Package = require('../../api/package/package.model');

module.exports = function () {
  var deferred = Q.defer();
  Package.find({}).remove(function () {
    Package.create(
      {
        name: 'movie-list',
        repo: 'git://github.com/nachos/dip-movie-list.git',
        type: 'dip'
      },
      {
        name: 'translation',
        repo: 'git://github.com/nachos/dip-translation.git',
        type: 'dip'
      },
      function (err) {
        if (err) {
          deferred.reject(err);
        } else {
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