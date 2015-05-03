'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissions = [
  'read_users',
  'write_users',
  'read_roles',
  'write_roles'
];

var RoleSchema = new Schema({
  name: {type: String, required: true},
  permissions: [{
      type: String,
      lowercase: true
    }]
});

/**
 * Validations
 */

// Validate permissions
RoleSchema
  .path('name')
  .validate(function (name) {
    return name && name.length;
  }, 'שם התפקיד אינו יכול להיות ריק.');

// Validate name is not taken
RoleSchema
  .path('name')
  .validate(function (name, respond) {
    var self = this;
    this.constructor.findOne({name: name}, function (err, role) {
      if (err) throw err;
      if (role) {
        if (self.id === role.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'שם תפקיד זה נמצא כבר בשימוש');

// Validate permissions
RoleSchema
  .path('permissions')
  .validate(function (v) {
    return v.every(function (val) {
      return _.contains(permissions, val);
    });
  }, 'הרשאה אחת או יותר לא היו חוקיות.');

module.exports = mongoose.model('Role', RoleSchema);