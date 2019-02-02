require('./models/user.model');

var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
var logger = require('morgan');
var rfs = require('rotating-file-stream');

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('[:date[iso]] :method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream }));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
}

require('./configs/passport')(passport); //setup password

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('keyboard cat'));
// app.use(cookieSession({ secret: 'secret' }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  cookie: { maxAge: 60000 }
}));
// use passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.req = req;
  next();
});

app.use('/', require('./routes/index'));
app.use('/news', require('./routes/news'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const errorStatus = err.status || 500;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = errorStatus;

  // render the error page
  res.status(errorStatus);
  res.render('error');
});

module.exports = app;
