/**
 * Set up passport for authentication
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

module.exports = function(){
    // serialize user fn. - turns user object into an id
    passport.serializeUser(function(user,done){
        //serializing the user
        done(null, user._id);
    });

    // deserialize user fn. - turns id into a user object
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
          done(err, user);
        });
    });

    // (local) strategy - way of logging in
    passport.use('login', new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    }, function(email, password, done){
        User.findOne({email: email}, function(err, user){
            if (err) { return done(err); }
            //user DNE
            if (!user) {
                return done(null, false, {message: 'No user has that email!'});
            }

            //check the password
            user.checkPassword(password, function(err, isMatch){
                if (err) { return done(err); }

                //check if matches DB record
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Invalid password.'});
                }
            });
        });
    }));
};