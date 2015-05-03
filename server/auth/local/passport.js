var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../api/user/user.model');
var logger = require('../../components/logger');

exports.setup = function () {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function (email, password, done) {
      User.findOneQ({
        email: email.toLowerCase()
      }, 'salt hashedPassword')
        .then(function (user) {
          if (!user) {
            return done(null, false, {message: 'האימייל לא נמצא במערכת.'});
          }
          if (!user.authenticate(password)) {
            return done(null, false, {message: 'הסיסמא שהזנת אינה תקינה.'});
          }
          return done(null, user);
        })
        .catch(function (err) {
          logger.error({err: err});

          done(err);
        });
    }
  ));
};