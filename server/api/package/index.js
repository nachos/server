'use strict';

var express = require('express');
var controller = require('./package.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasPermissions('read_packages'), controller.index);
router.get('/:id', auth.hasPermissions('read_packages'), controller.show);
router.post('/', auth.hasPermissions('write_packages'), controller.create);
router.put('/:id', auth.hasPermissions('write_packages'), controller.update);
router.delete('/:id', auth.hasPermissions('write_packages'), controller.destroy);

module.exports = router;