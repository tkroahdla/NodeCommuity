var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '\\' + '.env'});

var indexRouter = require('./routes/index');
var app = express();

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

/* Session */
app.use(session({
    HttpOnly: true, // true로 하면 사용자가 자바스크립트 통해서 세션 사용불가 (권장)
    secure: true, //https 에서만 세션을 주고받을 수 있음 ( http 에서는 불가 )
    secret: process.env.SECRET, // .env에서 SECRET값 가져오기
    resave: false,  // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
    saveUninitialized: true,  // 세션에 저장할 때 초기화할지 여부
    cookie: { maxAge: 24000 * 60 * 60 }  //쿠키의 생명주기 단위는 ms
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
