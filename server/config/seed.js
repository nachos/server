/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Q = require('q');
var populateUsers = require('./seed-data/users');
var populateRoles = require('./seed-data/roles');

module.exports = function () {
  populateRoles()
    .then(function (roles) {
      return populateUsers(roles);
    })
    .then(function () {
      console.log('Finished populating database.');
    })
    .fail(function (err) {
      console.log('Unable to populate database: ' + err);
    });
};