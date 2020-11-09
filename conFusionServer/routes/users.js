var express = require('express');
var userRouter = express.Router();
var bodyParser = require('body-parser');

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
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user != null) {
          var err = new Error("User " + req.body.username + " already exists!");
          err.status = 403;
          next(err);
        }
        else {
          return Users.create({
            username: req.body.username,
            password: req.body.password
          });
        }
      })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: "Registration Successfull!", user: user });
      }, (err) => next(err))
      .catch((err) => next(err));
  });


// users/login (endpoint)

userRouter.route('/login')
  .post((req, res, next) => {

    if (req.session.user == null) {
      var authHeader = req.headers.authorization; // extracting authorization from res.headers
      if (authHeader == null) {
        var err = new Error("You are not authenticated.");
        res.setHeader('WWW-Authenticate', "Basic");
        err.status = 401;
        next(err);
      }
      else {
        // split the "base username:password" to username:password (encoded in base64)
        // then again split username:password to username and passowrd
        var auth = new Buffer.from(authHeader.split(" ")[1], 'base64').toString().split(":");
        var username = auth[0];
        var password = auth[1];

        Users.findOne({ username: username })
          .then((user) => {
            if (user === null) {
              var err = new Error("User " + username + " does not exist!");
              err.status = 403;
              next(err);
            }
            else if (user.password !== password) {
              var err = new Error("Your password is incorrect.");
              err.status = 403;
              nexr(err);
            }
            else if (user.username === username && user.password === password) {
              req.session.user = "authenticated"; // setting up SESSION
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain')
              res.end('You are authenticated!');
            }
          })
          .catch((err) => next(err));
      }
    }
    else { // check user property in signed-cookie is valid
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
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
