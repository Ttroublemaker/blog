const env = process.env.NODE_ENV //环境参数

// 配置
let MYSQL_CONFIG
let REDIS_CONFIG

if (env === 'dev') {
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '1993zyhkcs',
    port: '3306',
    database: 'my-blog'
  }
  REDIS_CONFIG = {
    port: '6379',
    host: '127.0.0.1'
  }
}
if (env === 'production') {
  // 线上配置先使用下本地的配置
  MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '1993zyhkcs',
    port: '3306',
    database: 'my-blog'
  }
  REDIS_CONFIG = {
    port: '6379',
    host: '127.0.0.1'
  }
}
module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG
}