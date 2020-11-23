var express = require('express');
var userRouter = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

userRouter.use(bodyParser.json());

//---------------- CORS ------------------------------
const cors = require('./cors');
//----------------------------------------------------

//---------------------DATABASE-------------------------------
var mongoose = require('mongoose');
var Users = require('../models/users');
//------------------------------------------------------------


// users (endpoint)

/* GET users listing. */
userRouter.route('/')
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Users.find({})
      .then((allUsers) => {
        res.setHeader("Content-Type", "application/json");
        res.status = 200;
        res.json(allUsers)
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// users/signup (endpoint)

userRouter.route('/signup')
  .post(cors.corsWithOptions, (req, res, next) => {
    // register(new Users()) -> parameter (username, password, callback function)
    Users.register(new Users({ username: req.body.username }), req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        }
        else {
          // if user is registered successfully then add firstname and lastname
          if (req.body.firstname) {
            user.firstname = req.body.firstname;
          }
          if (req.body.lastname) {
            user.lastname = req.body.lastname;
          }
          // modifications are made so we need to save the "user" document
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
            }
            else {
              passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: "Registration Successfull!" });
              });
            }
          });
        }
      });
  });


// users/login (endpoint)

userRouter.route('/login')// expects that username and password is in req.body instead of req.headers.authorization
  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {

    // SETTING UP TOKEN for CLIENT (no need of sessions)
    var token = authenticate.getToken({ _id: req.user._id });


    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, userHeader: req.user, status: "You are successfully logged in!" });
  });



// facebook loging
// users/facebook/token (endpoint)

userRouter.route('/facebook/token')
  .get(passport.authenticate('facebook-token'), (req, res, next) => {
    // if successfull then passport will load req.user property
    if (req.user) {
      // generate token
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, userHeader: req.user, status: "You are successfully logged in through facebook!" })
    }
  });


// users/logout (endpoint)

userRouter.route('/logout')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    if (req.session) {
      // removes session from server
      req.session.destroy();
      res.clearCookie('session-id'); // asks client to remove cookie stored in browser
      res.redirect('/') // redirect user to standard page
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });


module.exports = userRouter;
