'use strict';

var passport = require('passport');
var auth = require('../auth.service');

exports.index =  function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'something went wrong, please try again.'});

    res.json({token: auth.signToken(user._id)});
  })(req, res, next);
};