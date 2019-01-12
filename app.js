var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rfs = require('rotating-file-stream');

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);


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
