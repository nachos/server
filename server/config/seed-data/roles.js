'use strict';

var Q = require('q');
var _ = require('lodash');
var Role = require('../../api/role/role.model');

module.exports = function () {
  var deferred = Q.defer();

  Role.find({})
    .remove(function () {
      Role.create({
        name: 'admin',
        permissions: [
          'read_users',
          'write_users',
          'read_roles',
          'write_roles',
          'read_packages',
          'write_packages'
        ]
      }, function (err) {
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