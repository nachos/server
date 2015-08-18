'use strict';

var Q = require('q');
var _ = require('lodash');
var User = require('../../api/user/user.model');

module.exports = function (roles) {
  var deferred = Q.defer();

  User.find({}).remove(function () {
    User.create({
      name: {
        first: 'burrito',
        last: 'man'
      },
      gender: 'male',
      email: 'burrito@gmail.com',
      roles: [
        roles[0]
      ],
      password: 'burrito'
    }, {
      name: {
        first: 'nacho',
        last: 'nachos'
      },
      gender: 'male',
      email: 'nacho@gmail.com',
      password: 'nacho'
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