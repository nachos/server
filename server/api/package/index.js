'use strict';

var express = require('express');
var controller = require('./package.controller');
var auth = require('../../auth/auth.service');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var _ = require('lodash');

var router = express.Router();

var enumValidator = function (options) {
  return function (req, res, next, val) {
    if (_.contains(options, val.toLowerCase())) {
      return next();
    }
    else {
      res.status(400).end();
    }
  };
};

router.param('os', enumValidator(['win32', 'darwin', 'linux']));
router.param('arch', enumValidator(['x64', 'ia32']));

router.get('/', controller.index);
router.get('/:name', controller.show);
router.put('/:name', auth.hasPermissions('write_packages'), controller.update);
router.delete('/:name', auth.hasPermissions('write_packages'), controller.destroy);
router.get('/:name/tarball/:os/:arch', controller.tarballDownload);
router.post('/:name/tarball/:os/:arch', auth.hasPermissions('write_packages'), upload.single('package'), controller.tarballUpload);
router.put('/:name/tarball/:os/:arch', auth.hasPermissions('write_packages'), upload.single('package'), controller.tarballUpload);

module.exports = router;