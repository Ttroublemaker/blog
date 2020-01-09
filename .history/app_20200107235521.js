var createError = require('http-errors'); //404 未命中处理
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser'); //解析cookie
var logger = require('morgan'); // 日志功能
// 手动引入express-session,connect-redis
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

// 引入路由
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

// 触发app
var app = express();

// view engine setup 纯后端项目用不着
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev')); //使用日志,还能传入第二个参数
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境/测试环境
  app.use(logger('dev'))
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}



app.use(express.json()); //post 数据处理 (类型为application/json)
//post 数据处理 (兼容其他数据格式)
app.use(express.urlencoded({
  extended: false
}));
// 解析cookie
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); //无用


const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 添加session
app.use(session({
  secret: 'qwcrqwtcyqegqerh', //密钥
  cookie: {
    path: '/', //根路径,默认'/'
    httpOnly: true, //默认 true
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// 注册路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

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