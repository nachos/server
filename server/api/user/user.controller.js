'use strict';

var User = require('./user.model');
var Role = require('../role/role.model');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var logger = require('../../components/logger');
var auth = require('../../auth/auth.service');
var Q = require('q');
var _ = require('lodash');

/**
 * Get list of users
 */
exports.index = function (req, res) {
  User.findQ({})
    .then(function (users) {
      if (!users) {
        res.status(404).end();
      }
      else {
        res.status(200).json(users);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res) {
  var newUser = new User(req.body);
  newUser.saveQ()
    .then(function (user) {
      res.json({
        token: auth.signToken(user._id)
      });
    }, function (err) {
      res.status(422).json(err);
    })
    .catch(function (err) {
      logger.error({err: err, req: req});
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res) {
  User.findByIdQ(req.params.id)
    .then(function (user) {
      if (!user) {
        res.status(404).end();
      }
      else {
        res.status(200).json(user.profile);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

/**
 * Deletes a user
 */
exports.destroy = function (req, res) {
  User.findOneAndRemoveQ({_id: req.params.id})
    .then(function (user) {
      if (!user) {
        res.status(404).end();
      } else {
        res.status(204).end();
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res) {
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdQ(req.user._id, 'salt hashedPassword')
    .then(function (user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveQ();
      } else {
        res.status(403).end();
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


// Updates an existing user in the DB.
exports.update = function (req, res) {
  var data = _.pick(req.body, ['name', 'email', 'gender']);

  User.findByIdQ(req.params.id)
    .then(function (user) {
      if (!user) {
        res.status(404).end();
      }
      else {
        user.set(data);
        return user.saveQ();
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

/**
 * Get my info
 */
exports.me = function (req, res) {
  res.json(req.user);
};

/**
 * Add role to user
 */
exports.addRole = function (req, res) {
  Q.all([User.findByIdQ(req.params.id), Role.findByIdQ(req.body.roleId)])
    .spread(function (user, role) {
      if (!user || !role) {
        res.status(404).end();
      }
      else {
        if (_.find(user.roles, function (id) {
            return id.equals(role._id);
          })) {
          res.status(409).end();
        }
        else {
          user.roles.push(role);
          return user.saveQ();
        }
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

/**
 * Remove role from user
 */
exports.removeRole = function (req, res) {
  Q.all([User.findByIdQ(req.params.id), Role.findByIdQ(req.body.roleId)])
    .spread(function (user, role) {
      if (!user || !role) {
        res.status(404).end();
      }
      else {
        if (!_.find(user.roles, function (id) {
            return id.equals(role._id);
          })) {
          res.status(409).end();
        }
        else {
          _.remove(user.roles, function (id) {
            return id.equals(role._id);
          });

          user.markModified('roles');
          return user.saveQ();
        }
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
