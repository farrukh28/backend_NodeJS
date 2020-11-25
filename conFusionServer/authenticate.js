const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // provides passport-strategy for Local Authentication
const JwtStrategy = require('passport-jwt').Strategy; // provides JWT-strategy for Local Authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // provides a method to extract JSON-Token form request
const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook-token');


const config = require('./config'); // configuration file


// Importing models where passport-local-mongoose is plugged-in
const User = require('./models/users');

// use static authenticate method of model in LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));


// In order to use sessions with passport support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Generating Token for the valid user
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }); // generates a token
};

// Configuring JWT
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log("JWT Payload : ", jwt_payload);
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


// Will check the user has "admin" previliges or not
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin == true) {
        next();
    }
    else {
        var err = new Error("You are not authorised to perform this action");
        err.status = 403;
        next(err);
    }
};


// facebook strategy for loging in through facebook

exports.facebookPassport = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
}, (accessToken, refreshToken, profile, done) => {

    // checks whether user has already logged in through facebook or not
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) { // if any error occurs
            return done(err, false);
        }
        if (!err && user !== null) { // checks whether user already exists or not in database
            return done(null, user);
        }
        else { // if user does not exist in database
            // username will be in profile.displayName
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err) {
                    return done(err, false);
                }
                else {
                    done(null, user);
                }
            });
        }
    })
}));




// Import this file where authentication is required like in routes