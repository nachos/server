'use strict';

var express = require('express');
var config = require('../config/environment');

// Passport Configuration
require('./local/passport').setup(config);
require('./facebook/passport').setup(config);
require('./google/passport').setup(config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/google', require('./google'));

module.exports = router;