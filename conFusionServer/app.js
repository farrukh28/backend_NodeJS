var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express(); // making our app to use EXPRESS


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


function auth(req, res, next) {
  console.log(req.headers);

  var authHeader = req.headers.authorization;
  if (authHeader == null) {
    var err = new Error("You are not authenticated!");
    res.setHeader('WWW-Authenticate', "Basic");
    err.status = 401;
    next(err);
  }
  else {
    var auth = new Buffer.from(authHeader.split(" ")[1], 'base64').toString().split(":");

    var username = auth[0];
    var password = auth[1];

    if (username === 'admin' && password === 'password') {
      next();
    }
    else {
      var err = new Error("You are not authenticated!");
      res.setHeader('WWW-Authenticate', "Basic");
      err.status = 401;
      next(err);
    }
  }
};

app.use(auth); // Basic Authentication

app.use(express.static(path.join(__dirname, 'public')));



//-------------- Importing ROUTERS------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
//-------------------------------------------------
//----------------- Mounting Routers------------
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
//----------------------------------------------

//------------------ DATABASE INTERACTIONS-----------------

var mongoose = require('mongoose');
const url = "mongodb://127.0.0.1:27017/conFusion";

// connecting to DATABASE
const connect = mongoose.connect(url, { useNewUrlParser: true }); // connecting to database

connect.then((db) => {
  console.log("Server connected successfully!");
}, (err) => {
  console.log(err);
});

//---------------------------------------------------------




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
