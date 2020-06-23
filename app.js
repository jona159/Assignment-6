var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var createrRouter = require('./routes/create');
var mongoRouter = require('./routes/mongo')



app = express();

// view engine setup




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/create', createrRouter);
app.use('/mongo', mongoRouter);

app.use("/leaflet", express.static(__dirname + "/node_modules/leaflet/dist"));
app.use("/leaflet-draw", express.static(__dirname + "/node_modules/leaflet-draw/dist"));
app.use("/leaflet-heat", express.static(__dirname + "/node_modules/leaflet-heat/dist"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message)
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({err});
});

module.exports = app;
