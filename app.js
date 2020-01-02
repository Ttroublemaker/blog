var createError = require('http-errors'); //404 未命中处理
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //解析cookie
var logger = require('morgan'); // 日志功能

// 引入路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 触发app
var app = express();

// view engine setup 纯后端项目用不着
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //使用日志
app.use(express.json()); //post 数据处理 (类型为application/json)
//post 数据处理 (兼容其他数据格式)
app.use(express.urlencoded({
  extended: false
}));
// 解析cookie
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //无用

// 注册路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // 引入了环境变量,所以将development 修改成dev
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;