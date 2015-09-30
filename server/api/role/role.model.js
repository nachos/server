'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissions = [
  'read_users',
  'write_users',
  'read_roles',
  'write_roles',
  'read_packages',
  'write_packages'
];

var RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  permissions: [
    {
      type: String,
      lowercase: true
    }
  ]
});

/**
 * Validations
 */

// Validate permissions
RoleSchema
  .path('name')
  .validate(function (name) {
    return name && name.length;
  }, 'role name cannot be empty.');

// Validate name is not taken
RoleSchema
  .path('name')
  .validate(function (name, respond) {
    var self = this;

    this.constructor.findOne({name: name}, function (err, role) {
      if (err) {
        throw err;
      }

      if (role) {
        if (self.id === role.id) {
          return respond(true);
        }

        return respond(false);
      }

      respond(true);
    });
  }, 'role name already used.');

// Validate permissions
RoleSchema
  .path('permissions')
  .validate(function (v) {
    return v.every(function (val) {
      return _.contains(permissions, val);
    });
  }, 'one or more invalid permissions.');

module.exports = mongoose.model('Role', RoleSchema);