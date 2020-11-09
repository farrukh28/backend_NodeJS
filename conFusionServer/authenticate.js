const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // provides a strategy for Local Authentication


// Importing models where passport-local-mongoose is plugged-in
const User = require('./models/users');

// use static authenticate method of model in LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));


// In order to use sessions with passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());