var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');


var config = require('./config'); // config file containing secretKey and mongoUrl


//-------------- Importing ROUTERS------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
//-------------------------------------------------


var app = express(); // making our app to use EXPRESS

//------------ Redirect all Requests to HTTPS server------

app.all('*', (req, res, next) => {
  // if request is from secure connection(https) req.secure will set to be "true"
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

//--------------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//--------------------- Passport------------------

app.use(passport.initialize());

//------------------------------------------------



app.use(express.static(path.join(__dirname, 'public')));



//----------------- Mounting Routers------------

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
//----------------------------------------------

//------------------ DATABASE INTERACTIONS-----------------


const url = config.mongoUrl;

// connecting to DATABASE
mongoose.set('useCreateIndex', true);
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); // connecting to database

connect.then((db) => {
  console.log("Database Server connected successfully!");
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
