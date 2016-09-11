var passport = require('passport'),
    LocalPassport = require('passport-local'),
    User = require('mongoose').model('User');

var TokenStrategy = require('passport-token').Strategy;

module.exports = function() {
    passport.use(new LocalPassport(function(username, password, done) {
        User.findOne({ username: username }).exec(function(err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
                return;
            }

            if (user && user.authenticate(password)) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }));



     /*   passport.use(new TokenStrategy(
            function (username, token, done) {
                User.findOne({username: username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, false);
                    }

                    if (!user.verifyToken(token)) {
                        return done(null, false);
                    }

                    //user.token = token;
                    return done(null, user);
                });
            }
        ));
*/
    passport.serializeUser(function(user, done) {
        if (user) {
            return done(null, user._id);
        }
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({_id: id}).exec(function(err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
                return;
            }

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    });
};