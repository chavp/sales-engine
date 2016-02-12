var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Member = mongoose.model('Member');

passport.use(new LocalStrategy({},
  function(username, password, done) {
    //console.log(username);
    Member
      .findOne({ username: username })
      //.populate('profile')
      //.populate('organizations')
      .exec(
        function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, {
              message: 'Invalid email address or password.'
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Invalid email address or password.'
            });
          }

          //console.log(user);
          return done(null, user);
        }
      );
  }
));