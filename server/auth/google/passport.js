var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../api/user/user.model');

exports.setup = function (config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      session: false,
      scope: [
        'https://www.googleapis.com/auth/profile',
        'https://www.googleapis.com/auth/email'
      ]
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, false, profile._json);
    }
  ));
};
