'use strict';

var _ = require('lodash');
var Package = require('./package.model');
var logger = require('../../components/logger');

// Get list of packages
exports.index = function (req, res) {
  Package.findQ({})
    .then(function (packages) {
      if (!packages) {
        res.status(404).end();
      }
      else {
        res.status(200).json(packages);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Get a single package
exports.show = function (req, res) {
  Package.findOneQ({name: req.params.name})
    .then(function (pkg) {
      if (!pkg) {
        res.status(404).end();
      }
      else {
        res.status(200).json(pkg);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Creates a new package in the DB.
exports.create = function (req, res) {
  var newPackage = new Package(req.body);
  newPackage.saveQ()
    .then(function (pkg) {
      if (!pkg) {
        res.status(500).end();
      }
      else {
        res.status(201).json(pkg);
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

// Updates an existing package in the DB.
exports.update = function (req, res) {
  var data = _.pick(req.body, ['name', 'repo']);

  Package.findOneQ({name: req.params.name})
    .then(function (pkg) {
      if (!pkg) {
        res.status(404).end();
      }
      else {
        pkg.set(data);
        return pkg.saveQ();
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

// Deletes a package from the DB.
exports.destroy = function (req, res) {
  Package.findOneAndRemoveQ({name: req.params.name})
    .then(function (pkg) {
      if (!pkg) {
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