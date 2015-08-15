'use strict';

var express = require('express');
var controller = require('./package.controller');
var auth = require('../../auth/auth.service');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var router = express.Router();

router.get('/', controller.index);
router.get('/:name', controller.show);
router.post('/', auth.hasPermissions('write_packages'), controller.create);
router.put('/:name', auth.hasPermissions('write_packages'), controller.update);
router.delete('/:name', auth.hasPermissions('write_packages'), controller.destroy);
router.get('/:name/tarball', controller.tarballDownload);
router.post('/:name/tarball', upload.single('package'), controller.tarballUpload);
router.put('/:name/tarball', upload.single('package'), controller.tarballUpload);

module.exports = router;