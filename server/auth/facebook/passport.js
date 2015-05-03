var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      session: false,
      profileFields: [
        'id',
        'link',
        'picture.type(large)',
        'email',
        'first_name',
        'last_name',
        'gender'
      ]
    },
    function(req, accessToken, refreshToken, profile, done) {
      done(null, false, profile._json);
    }
  ));
};