const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // provides passport-strategy for Local Authentication
const JwtStrategy = require('passport-jwt').Strategy; // provides JWT-strategy for Local Authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // provides a method to extract JSON-Token form request
const jwt = require('jsonwebtoken');


const config = require('./config'); // configuration file


// Importing models where passport-local-mongoose is plugged-in
const User = require('./models/users');

// use static authenticate method of model in LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));


// In order to use sessions with passport support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Generating Token for the valid user
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }); // generates a token
};

// Configuring JWT
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload : ", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false)
        }
    }); // end of findOne
}));

// We will not be using sessions
// this method is used to verify authentication in routes where required
exports.verifyUser = passport.authenticate('jwt', { session: false });

// Import this file where authentication is required like in routes