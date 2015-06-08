'use strict';

var express = require('express');
var controller = require('./package.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:name', controller.show);
router.post('/'/*, auth.hasPermissions('write_packages')*/, controller.create);
router.put('/:name', auth.hasPermissions('write_packages'), controller.update);
router.delete('/:name', auth.hasPermissions('write_packages'), controller.destroy);

module.exports = router;