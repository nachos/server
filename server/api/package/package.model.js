'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var types = [
  'dip',
  'taco'
];

var PackageSchema = new Schema({
  name: {type: String, required: true, lowercase: true},
  repo: {type: String, required: true, lowercase: true},
  type: {type: String, required: true, lowercase: true}
});

/**
 * Validations
 */

// Validate permissions
PackageSchema
  .path('name')
  .validate(function (name) {
    return name && name.length;
  }, 'name cannot be empty.');

// Validate name is not taken
PackageSchema
  .path('name')
  .validate(function (name, respond) {
    var self = this;

    this.constructor.findOne({name: name}, function (err, pkg) {
      if (err) {
        throw err;
      }

      if (pkg) {
        return self.id === pkg.id ? respond(true) : respond(false);
      }

      respond(true);
    });
  }, 'name already taken.');

// Validate type
PackageSchema
  .path('type')
  .validate(function (val) {
    return _.contains(types, val);
  }, 'invalid type.');

module.exports = mongoose.model('Package', PackageSchema);