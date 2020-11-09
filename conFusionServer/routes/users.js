var express = require('express');
var userRouter = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

userRouter.use(bodyParser.json());

//---------------------DATABASE-------------------------------
var mongoose = require('mongoose');
var Users = require('../models/users');
//------------------------------------------------------------


// users (endpoint)

/* GET users listing. */
userRouter.route('/')
  .get((req, res, next) => {
    res.send('respond with a resource');
  });


// users/signup (endpoint)

userRouter.route('/signup')
  .post((req, res, next) => {
    // register parameter (username, password, callback function)
    Users.register(new Users({ username: req.body.username }), req.body.password,
      (err, user) => {
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
  });


// users/login (endpoint)

userRouter.route('/login')// expected that username and password is in req.body instead of req.headers.authorization
  .post(passport.authenticate('local'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: "You are successfully logged in!" });
  });


// users/logout (endpoint)

userRouter.route('/logout')
  .get((req, res, next) => {
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
