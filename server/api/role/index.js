'use strict';

var express = require('express');
var controller = require('./role.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasPermissions('read_roles'), controller.index);
router.get('/:id', auth.hasPermissions('read_roles'), controller.show);
router.post('/', auth.hasPermissions('write_roles'), controller.create);
router.put('/:id', auth.hasPermissions('write_roles'), controller.update);
router.delete('/:id', auth.hasPermissions('write_roles'), controller.destroy);

module.exports = router;