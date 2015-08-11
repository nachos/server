'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', controller.create);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/:id/addRole', auth.isAuthenticated(), controller.addRole);
router.post('/:id/removeRole', auth.isAuthenticated(), controller.removeRole);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
