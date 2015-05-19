var Q = require('q');
var _ = require('lodash');
var Package = require('../../api/package/package.model');

module.exports = function () {
  var deferred = Q.defer();
  Package.find({}).remove(function () {
    Package.create({
      name: 'movie-list',
      repo: 'nachos/movie-list',
      type: 'dip'
    }, function (err) {
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