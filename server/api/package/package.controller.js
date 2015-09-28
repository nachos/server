'use strict';

var _ = require('lodash');
var Package = require('./package.model');
var registry = require('./package.registry');
var logger = require('../../components/logger');
var sanitize = require('sanitize-filename');

var controller = {};

// Get list of packages
controller.index = function (req, res) {
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
controller.show = function (req, res) {
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

// Updates an existing package in the DB.
controller.update = function (req, res) {
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
controller.destroy = function (req, res) {
  Package.findOneAndRemoveQ({name: req.params.name})
    .then(function (pkg) {
      if (!pkg) {
        res.status(404).end();
      }
      else {
        res.status(204).end();
      }
    })
    .catch(function (err) {
      logger.error({err: err, req: req});

      res.status(500).end();
    });
};

controller.tarballDownload = function (req, res, next) {
  var pkgName = sanitize(req.params.name);
  var stream = registry.download(pkgName);

  stream.on('error', function (err) {
    return next(err);
  });

  res.attachment(pkgName + '.tgz');
  stream.pipe(res);
};

controller.tarballUpload = function (req, res) {
  var pkgName = sanitize(req.params.name);

  Package.findOneQ({name: pkgName})
    .then(function (pkg) {
      if (pkg && !_.some(pkg.owners, req.user._id)) {
        return res.status(403).send();
      }

      var uploadedFile = req.file.path;

      registry.upload(uploadedFile, pkgName)
        .then(function (nachosJson) {
          pkg = pkg || {
              name: pkgName,
              owners: [req.user._id],
              time: {
                created: new Date()
              }
            };

          // TODO: Validate
          pkg = _.merge(pkg, nachosJson);
          pkg.time.updated = new Date();

          return Package.updateQ({name: pkgName}, pkg, {upsert: true});
        })
        .then(function () {
          res.status(200).send();
        })
        .catch(function (err) {
          logger.error({err: err, req: req});

          res.status(500).end();
        });
    });
};

module.exports = controller;