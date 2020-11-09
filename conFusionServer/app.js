var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


//-------------- Importing ROUTERS------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
//-------------------------------------------------


var app = express(); // making our app to use EXPRESS


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // signed cookies

// ---------------------- SESSION MIDDLEWARE----------------------
app.use(session({
  name: "session-id",
  secret: "12345-67890-09876-54321",
  saveUninitialized: false,
  resave: false,
  store: new FileStore() // store session information in file instead of memory(default)
}));

// -----------------Mounting Routers -----------------------------
// So users can access login/signup page before any authentication

app.use('/', indexRouter);
app.use('/users', usersRouter);

//--------------------------------------------------------

function auth(req, res, next) {
  console.log(req.session); // to see what's included in session

  if (req.session.user == null) {

    var err = new Error("You are not authenticated!");
    res.setHeader('WWW-Authenticate', "Basic");
    err.status = 403;
    return next(err);
  }
  else { // check user property in signed-cookie is valid
    if (req.session.user == 'authenticated') {
      next();
    }
    else {
      var err = new Error("You are not authenticated!");
      err.status = 403;
      next(err);
    }
  };
}


app.use(auth); // Basic Authentication

app.use(express.static(path.join(__dirname, 'public')));



//----------------- Mounting Routers------------

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
