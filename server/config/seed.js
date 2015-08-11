/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var populateUsers = require('./seed-data/users');
var populateRoles = require('./seed-data/roles');
var populatePackages = require('./seed-data/packages');

module.exports = function () {
  populateRoles()
    .then(function (roles) {
      return populateUsers(roles);
    })
    .then(function () {
      return populatePackages();
    })
    .then(function () {
      console.log('Finished populating database.');
    })
    .fail(function (err) {
      console.log('Unable to populate database: ' + err);
    });
};