'use strict';

var _ = require('lodash');
var Role = require('./role.model');
var User = require('../user/user.model');
var logger = require('../../components/logger');

// Get list of roles
exports.index = function (req, res) {
  Role.findQ({})
    .then(function (roles) {
      if (!roles) {
        res.status(404).end();
      }
      else {
        res.status(200).json(roles);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Get a single role
exports.show = function (req, res) {
  Role.findByIdQ(req.params.id)
    .then(function (role) {
      if (!role) {
        res.status(404).end();
      }
      else {
        res.status(200).json(role);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Creates a new role in the DB.
exports.create = function (req, res) {
  var newRole = new Role(req.body);

  newRole.saveQ()
    .then(function (role) {
      if (!role) {
        res.status(500).end();
      }
      else {
        res.status(201).json(role);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Updates an existing role in the DB.
exports.update = function (req, res) {
  // TODO: decide what more to pick
  var data = _.pick(req.body, ['name', 'permissions']);

  Role.findByIdQ(req.params.id)
    .then(function (role) {
      if (!role) {
        res.status(404).end();
      }
      else {
        role.set(data);

        return role.saveQ();
      }
    })
    .then(function () {
      res.status(200).end();
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Deletes a role from the DB.
exports.destroy = function (req, res) {
  Role.findOneAndRemoveQ({_id: req.params.id})
    .then(function (role) {
      if (!role) {
        res.status(404).end();
      }
      else {
        res.status(204).end();

        return User.updateQ(
          {roles: role._id},
          {$pull: {roles: role._id}},
          {multi: true}
        );
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};