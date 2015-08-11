'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var types = [
  'dip',
  'taco'
];

var PackageSchema = new Schema({
  name: {type: String, required: true, lowercase: true},
  version: {type: String, required: true, lowercase: true},
  time: {
    created: {type: Date, required: true},
    modified: {type: Date, required: true}
  },
  description: {type: String},
  keywords: [{type: String, lowercase: true}],
  homepage: {type: String},
  owners: [{type: Schema.Types.ObjectId, ref: 'User'}],
  repository: {type: String},
  dist: {
    tarball: {type: String, required: true},
    shasum: {type: String, required: true, lowercase: true}
  },
  type: {type: String, required: true, enum: types}
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

module.exports = mongoose.model('Package', PackageSchema);