const mongoose = require('mongoose');
const User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const localSettings = {
    usernameField: 'username',
    passwordField: 'password'
}

// todo: move to config
const fbSettings = {
    clientID: 238496927059491,
    clientSecret: 'bdff05dbbcb8a392f1726131b7d6f10c',
    callbackURL: "http://localhost:3000/auth/facebook/callback",

    profileFields: ['id', 'displayName']
}

const jwtSettings = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "jwtAuthSecret",
}

module.exports = function (passport) {
    // serialize sessions
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => {
        done(err, user);
    }));

    passport.use(new LocalStrategy(localSettings, function (username, password, done) {
        const options = {
            criteria: { username: username },
            select: 'username hashed_password salt'
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        });
    }
    ));

    passport.use(new FacebookStrategy(fbSettings, function (accessToken, refreshToken, profile, done) {
        const options = {
            criteria: { facebookId: profile.id },
            select: 'username hashed_password salt'
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                // todo: profile.displayName is not unique it is better to re-work auth to use email
                user = new User({ username: profile.displayName, password: "somedefaultpass!!!", facebookId: profile.id });
                user.save()
                    .then(user => {
                        return done(null, user);
                    })
                    .catch((err) => {
                        console.log(err);
                        return done(new Error('Error authenticating via Facebook, please try again later or contact administrator'));
                    });
            } else {
                return done(null, user);
            }
        });
    }));

    passport.use(new JwtStrategy(jwtSettings, function (jwt_payload, done) {
        console.log('jwt');
        User.findById(jwt_payload.id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};
